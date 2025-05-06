import { type GuildMember, PermissionFlagsBits } from "discord.js";
import { config } from "../config/config.js";
import { presentationChannelWelcomeMessage } from "../messages/presentation-channel-welcome.js";
import { addWelcomeChannel } from "../utils/welcomeManager.js";

export async function handleGuildMemberAdd(member: GuildMember) {
  console.log(`New member joined: ${member.user.username}`);

  try {
    // Create a welcome channel for the new member
    const channel = await member.guild.channels.create({
      name: `${member.user.username}-welcome`,
      type: 0, // text channel
      permissionOverwrites: [
        {
          id: member.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: member.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        // Allow admins to view the channel
        {
          id: config.roles.admin,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    // Send welcome message to the new channel
    const welcomeMessage = await channel.send(
      presentationChannelWelcomeMessage(member.user.username),
    );

    // Store channel info in welcome manager
    addWelcomeChannel(channel.id, {
      memberId: member.id,
      welcomeMessageId: welcomeMessage.id,
    });
  } catch (error) {
    console.error("Error creating welcome channel:", error);
  }
}
