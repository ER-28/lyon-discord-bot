import type {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { config } from "../config/config.js";
import {
  type WelcomeChannelData,
  getWelcomeChannel,
  removeWelcomeChannel,
} from "../utils/welcomeManager.js";

export async function handleMessageReactionAdd(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
) {
  // Ignore bot reactions
  if (user.bot) return;

  // Fetch partial reactions
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Error fetching reaction:", error);
      return;
    }
  }

  // Check if this is a reaction in a welcome channel
  const channel = reaction.message.channel;
  const welcomeChannelData = getWelcomeChannel(channel.id);

  if (!welcomeChannelData) return;

  // Check if the reaction is the check mark for approval
  if (reaction.emoji.name === "✅") {
    await handleApprovalReaction(reaction, user, welcomeChannelData);
  }
}

async function handleApprovalReaction(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  welcomeChannelData: WelcomeChannelData,
) {
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
    const newMember = await guild.members.fetch(welcomeChannelData.memberId);

    // Add member role
    const memberRole = guild.roles.cache.find(
      (role) => role.name === config.roles.member,
    );
    if (memberRole) {
      await newMember.roles.add(memberRole);
    } else {
      console.error("Member role not found");
    }

    // Post to presentation channel
    const presentationChannel = guild.channels.cache.find(
      (ch) => ch.name === config.channels.presentation,
    );
    if (presentationChannel && presentationChannel.type === 0) {
      // Get the introduction message
      const introMessage = reaction.message.content;
      await presentationChannel.send(
        `New member approved: ${newMember.user.username} - ${introMessage}`,
      );
    } else {
      console.error("Presentation channel not found");
    }

    // Notify in the welcome channel
    const channel = reaction.message.channel;
    if (channel && channel.type === 0) {
      await channel.send(
        `Congratulations ${newMember.user.username}! You've been approved by ${adminMember.user.username} and given the ${config.roles.member} role.`,
      );
    }

    // Delete the welcome channel after a delay
    setTimeout(async () => {
      try {
        await channel.delete();
        // Remove from tracking
        removeWelcomeChannel(channel.id);
      } catch (error) {
        console.error("Error deleting welcome channel:", error);
      }
    }, config.welcome.deleteDelay);
  } catch (error) {
    console.error("Error processing approval reaction:", error);
  }
}
