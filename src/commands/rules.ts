import type { Message } from "discord.js";
import { rulesMessages } from "../messages/rules.js";

export async function handleRulesCommand(message: Message) {
  await message.reply(rulesMessages());
}
