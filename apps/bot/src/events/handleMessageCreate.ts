import type { Message, OmitPartialGroupDMChannel } from "discord.js";
import { handleCommands } from "../commands/index.js";
import { ArrivalsService } from "../services/arrivalsService.js";

export async function handleMessageCreate(
  message: OmitPartialGroupDMChannel<Message>,
) {
  if (message.author.bot) return;

  if (message.content.startsWith("!")) {
    await handleCommands(message);
    return;
  }

  await new ArrivalsService().handleMessageCreate(message);
}
