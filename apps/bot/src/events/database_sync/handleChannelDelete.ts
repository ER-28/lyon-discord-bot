import { Channel } from "@repo/database/models/channels";
import { DMChannel, type NonThreadGuildBasedChannel } from "discord.js";

export async function handleChannelDelete(
  channel: NonThreadGuildBasedChannel | DMChannel,
) {
  if (channel instanceof DMChannel) {
    console.log("DM channel delete event received.");
    return;
  }

  if (!channel.guild) return;

  const existingChannel = await Channel.findOne({ channelId: channel.id });
  if (!existingChannel) {
    console.log(`Channel ${channel.name} does not exist in the database.`);
    return;
  }

  // Delete the channel from the database
  await Channel.deleteOne({ channelId: channel.id });
}
