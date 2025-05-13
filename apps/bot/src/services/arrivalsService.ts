import { Arrival, type IArrival } from "@repo/database/models/arrivals";
import { Config, type IConfig } from "@repo/database/models/config";
import type {
  GuildMember,
  Message,
  MessageReaction,
  OmitPartialGroupDMChannel,
  PartialGuildMember,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { presentationMessages } from "../messages/presentation.js";

export class ArrivalsService {
  /**
   * Get guild configuration from MongoDB
   * @param guildId Guild ID
   * @returns Guild configuration or null if not found
   */
  private async getGuildConfig(guildId: string): Promise<IConfig | null> {
    return await Config.findOne({ guildId });
  }

  /**
   * Handle when a new member joins the guild
   * @param member The guild member who joined
   */
  async handleGuildMemberAdd(member: GuildMember) {
    // Create a welcome channel for the new member
    const channel = await member.guild.channels.create({
      name: `welcome-${member.user.username}`,
      type: 0,
      permissionOverwrites: [
        {
          id: member.id,
          allow: ["ViewChannel"],
        },
        {
          id: member.guild.roles.everyone,
          deny: ["ViewChannel"],
        },
      ],
    });

    const message = await channel.send({
      content: `Welcome to the server, ${member.user.username}!`,
    });

    // Create a new arrival record in the database
    const arrivals: IArrival = {
      status: "pending",
      member_id: member.id,
      channel_id: channel.id,
      message_id: message.id,
    };

    const arrivalModel = new Arrival(arrivals);
    await arrivalModel.save();
  }

  /**
   * Handle when a member leaves the guild
   * @param member The guild member who left
   */
  async handleGuildMemberRemove(member: GuildMember | PartialGuildMember) {
    const arrival = await Arrival.findOne({ member_id: member.id });
    if (!arrival) return;

    // Get guild configuration
    const guildConfig = await this.getGuildConfig(member.guild.id);
    if (!guildConfig) {
      console.error(`No configuration found for guild ${member.guild.id}`);
      return;
    }

    // If the member was accepted, remove their presentation message
    if (arrival.status === "accepted" && arrival.presentation_message_id) {
      const presentationChannelId = guildConfig.channel.presentation;

      if (presentationChannelId) {
        try {
          const presentationChannel = await member.guild.channels.fetch(
            presentationChannelId,
          );

          if (presentationChannel?.type === 0) {
            const message = await presentationChannel.messages.fetch(
              arrival.presentation_message_id,
            );
            if (message) {
              await message.delete();
            }
          }
        } catch (error) {
          console.error("Error deleting presentation message:", error);
        }
      }
    }

    // If the member was pending, delete their welcome channel
    if (arrival.status === "pending" && arrival.channel_id) {
      try {
        const channel = await member.guild.channels.fetch(arrival.channel_id);
        if (channel) {
          await channel.delete();
        }
      } catch (error) {
        console.error("Error deleting welcome channel:", error);
      }
    }

    // Remove the arrival record
    await Arrival.deleteOne({ member_id: member.id });
  }

  /**
   * Handle when a message is created in a welcome channel
   * @param message The message that was created
   */
  async handleMessageCreate(message: OmitPartialGroupDMChannel<Message>) {
    const channel = message.channel;

    // Find arrival record associated with this channel and author
    const arrival = await Arrival.findOne({
      channel_id: channel.id,
      member_id: message.author.id,
    });

    if (!arrival) return;

    // Handle the presentation message
    if (arrival.status === "pending" && arrival.message_id) {
      const presentation = message.content;

      try {
        // Fetch and edit the message to add the presentation
        const messageToEdit = await channel.messages.fetch(arrival.message_id);
        if (messageToEdit) {
          await messageToEdit.edit({
            content: `Welcome to the server, ${message.author.username}!\n\n**Presentation:**\n${presentation}`,
          });
        }

        await messageToEdit.react("✅");

        // Save the presentation to the arrival record
        arrival.presentation = presentation;
        await arrival.save();

        // Delete the original message
        await message.delete();
      } catch (error) {
        console.error("Error handling presentation message:", error);
      }
    }
  }

  /**
   * Handle when an approval reaction is added to a welcome message
   * @param reaction The reaction that was added
   * @param user The user who added the reaction
   */
  async handleApprovalReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    if (reaction.emoji.name !== "✅") return;

    const channel = reaction.message.channel;
    const arrival = await Arrival.findOne({
      channel_id: channel.id,
      message_id: reaction.message.id,
    });

    if (!arrival) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    try {
      // Get guild configuration
      const guildConfig = await this.getGuildConfig(guild.id);
      if (!guildConfig) {
        console.error(`No configuration found for guild ${guild.id}`);
        return;
      }

      const adminRoleId = guildConfig.roles.admin;
      const memberRoleId = guildConfig.roles.member;
      const presentationChannelId = guildConfig.channel.presentation;

      if (!adminRoleId || !memberRoleId || !presentationChannelId) {
        console.error(
          "Missing required configuration: admin role, member role, or presentation channel",
        );
        return;
      }

      // Fetch the member who reacted
      const adminMember = await guild.members.fetch(user.id);

      // Check if the user has admin role
      if (!adminMember.roles.cache.some((role) => role.id === adminRoleId)) {
        return;
      }

      // Get the new member to approve
      const newMember = await guild.members.fetch(arrival.member_id);

      // Add member role
      const memberRole = guild.roles.cache.find(
        (role) => role.id === memberRoleId,
      );

      if (memberRole) {
        await newMember.roles.add(memberRole);
      } else {
        console.error(`Member role ${memberRoleId} not found`);
        return;
      }

      // Post to presentation channel
      const presentationChannel = guild.channels.cache.find(
        (ch) => ch.id === presentationChannelId,
      );

      if (
        presentationChannel &&
        presentationChannel.type === 0 &&
        arrival.presentation
      ) {
        // Send the presentation to the presentation channel
        const sentMessage = await presentationChannel.send(
          presentationMessages(newMember.user.id, arrival.presentation),
        );

        // Save the presentation message ID and update status
        arrival.presentation_message_id = sentMessage.id;
        arrival.status = "accepted";
        arrival.channel_id = null;
        arrival.message_id = null;
        await arrival.save();
      } else {
        console.error("Presentation channel not found or presentation missing");
        return;
      }

      // Delete the welcome channel
      await channel.delete();
    } catch (error) {
      console.error("Error processing approval reaction:", error);
    }
  }
}
