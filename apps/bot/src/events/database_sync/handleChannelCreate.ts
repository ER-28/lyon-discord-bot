import { Channel, type IChannel } from "@repo/database/models/channels";
import type { NonThreadGuildBasedChannel } from "discord.js";

export async function handleChannelCreate(channel: NonThreadGuildBasedChannel) {
  if (!channel.guild) return;

  // Check if the channel already exists in the database
  const existingChannel = await Channel.findOne({ id: channel.id });
  if (existingChannel) {
    console.log(`Channel ${channel.name} already exists in the database.`);
    return;
  }

  // Create a new channel object
  const newChannel: IChannel = {
    channelId: channel.id,
    name: channel.name,
    type: channel.type.toString(),
  };

  // Save the new channel to the database
  const channelModel = new Channel(newChannel);
  await channelModel.save();
}
