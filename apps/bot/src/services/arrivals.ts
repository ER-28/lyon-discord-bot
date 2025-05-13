import { Arrival, type IArrival } from "@repo/database/models/arrivals";
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
import { config } from "../config/config.js";
import { presentationChannelCloseMessage } from "../messages/presentation-channel-close.js";
import { presentationMessages } from "../messages/presentation.js";

export class Arrivals {
  async handleGuildMemberAdd(member: GuildMember) {
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

    const arrivals: IArrival = {
      status: "pending",

      member_id: member.id,
      channel_id: channel.id,
      message_id: message.id,
    };

    const arrivalModel = new Arrival(arrivals);
    await arrivalModel.save();
  }

  async handleGuildMemberRemove(member: GuildMember | PartialGuildMember) {
    const arrival = await Arrival.findOne({ member_id: member.id });
    if (arrival) {
      if (arrival.status === "accepted" && arrival.presentation_message_id) {
        const presentationChannel = await member.guild.channels.fetch(
          config.channels.presentation,
        );

        if (presentationChannel?.type === 0) {
          const message = await presentationChannel.messages.fetch(
            arrival.presentation_message_id,
          );
          if (message) {
            await message.delete();
          }
        }
      }

      if (arrival.status === "pending" && arrival.channel_id) {
        const channel = await member.guild.channels.fetch(arrival.channel_id);
        if (channel) {
          await channel.delete();
        }
      }

      await Arrival.deleteOne({ member_id: member.id });
    }
  }

  async handleMessageCreate(message: OmitPartialGroupDMChannel<Message>) {
    const channel = message.channel;

    const arrival = await Arrival.findOne({
      channel_id: channel.id,
      member_id: message.author.id,
    });

    if (arrival) {
      if (arrival.status === "pending" && arrival.message_id) {
        const presentation = message.content;

        // fetch and edit the message to add the presentation with message_id in arrival
        const messageToEdit = await channel.messages.fetch(arrival.message_id);
        if (messageToEdit) {
          await messageToEdit.edit({
            content: `Welcome to the server, ${message.author.username}!\n\n**Presentation:**\n${presentation}`,
          });
        }

        await messageToEdit.react("✅");

        arrival.presentation = presentation;

        await arrival.save();

        await message.delete();
      }
    }
  }

  async handleApprovalReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    const channel = reaction.message.channel;
    const arrival = await Arrival.findOne({
      channel_id: channel.id,
      message_id: reaction.message.id,
    });

    if (!arrival) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    try {
      // Fetch the member who reacted
      const adminMember = await guild.members.fetch(user.id);

      // Check if the user has admin role
      if (
        !adminMember.roles.cache.some((role) => role.id === config.roles.admin)
      ) {
        return;
      }

      // Get the new member to approve
      const newMember = await guild.members.fetch(arrival.member_id);

      // Add member role
      const memberRole = guild.roles.cache.find(
        (role) => role.id === config.roles.member,
      );
      if (memberRole) {
        await newMember.roles.add(memberRole);
      } else {
        console.error("Member role not found");
      }

      // Post to presentation channel
      const presentationChannel = guild.channels.cache.find(
        (ch) => ch.id === config.channels.presentation,
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

        // Save the presentation message ID
        arrival.presentation_message_id = sentMessage.id;
        arrival.status = "accepted";
        arrival.channel_id = null;
        arrival.message_id = null;
        await arrival.save();
      } else {
        console.error("Presentation channel not found or presentation missing");
      }

      await channel.delete();
    } catch (error) {
      console.error("Error processing approval reaction:", error);
    }
  }
}
