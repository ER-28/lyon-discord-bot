import type { Message } from "discord.js";

export type WelcomeChannelData = {
  memberId: string;
  welcomeMessageId: string;
};

export type WelcomeChannelsData = Map<string, WelcomeChannelData>;

const welcomeChannels: WelcomeChannelsData = new Map();

export function addWelcomeChannel(channelId: string, data: WelcomeChannelData) {
  welcomeChannels.set(channelId, data);
}

export function getWelcomeChannel(
  channelId: string,
): WelcomeChannelData | undefined {
  return welcomeChannels.get(channelId);
}

export function removeWelcomeChannel(channelId: string) {
  welcomeChannels.delete(channelId);
}

export async function handleWelcomeMessage(
  message: Message,
  _channelInfo: WelcomeChannelData,
) {
  try {
    await message.react("✅");
  } catch (error) {
    console.error("Error adding reaction to welcome message:", error);
  }
}
