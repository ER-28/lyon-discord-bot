import { Channel } from "@repo/database/models/channels";
import { DMChannel, type NonThreadGuildBasedChannel } from "discord.js";
import { handleChannelCreate } from "./handleChannelCreate.js";

export async function handleChannelUpdate(
  _oldChannel: NonThreadGuildBasedChannel | DMChannel,
  channel: NonThreadGuildBasedChannel | DMChannel,
) {
  // Check if the channel is a DM channel or not
  if (channel instanceof DMChannel) {
    console.log("DM channel update event received.");
    return;
  }

  if (!channel.guild) return;

  // Check if the channel already exists in the database
  const existingChannel = await Channel.findOne({ channelId: channel.id });
  if (!existingChannel) {
    console.log(`Channel ${channel.name} does not exist in the database.`);
    await handleChannelCreate(channel);
    return;
  }

  // Update the channel object
  existingChannel.name = channel.name;
  existingChannel.type = channel.type.toString();

  // Save the updated channel to the database
  await existingChannel.save();
}
