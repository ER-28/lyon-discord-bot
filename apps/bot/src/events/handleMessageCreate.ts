import type { Message, OmitPartialGroupDMChannel } from "discord.js";
import { handleCommands } from "../commands/index.js";
import { Arrivals } from "../services/arrivals.js";

export async function handleMessageCreate(
  message: OmitPartialGroupDMChannel<Message>,
) {
  if (message.author.bot) return;

  if (message.content.startsWith("!")) {
    await handleCommands(message);
    return;
  }

  await new Arrivals().handleMessageCreate(message);
}
