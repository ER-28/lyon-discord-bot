import type { Message, OmitPartialGroupDMChannel } from "discord.js";
import { handleCommands } from "../commands/index.js";
import {
  getWelcomeChannel,
  handleWelcomeMessage,
} from "../utils/welcomeManager.js";

/**
 * Handle message create event
 * @param {import('discord.js').Message} message - Discord message
 */
export async function handleMessageCreate(
  message: OmitPartialGroupDMChannel<Message>,
) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Process commands if message starts with command prefix
  if (message.content.startsWith("!")) {
    await handleCommands(message);
    return;
  }

  // Check if this is a message in a welcome channel
  const welcomeChannelInfo = getWelcomeChannel(message.channel.id);
  if (welcomeChannelInfo && message.author.id === welcomeChannelInfo.memberId) {
    await handleWelcomeMessage(message, welcomeChannelInfo);
  }
}
