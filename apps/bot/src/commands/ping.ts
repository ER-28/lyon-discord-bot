import type { Message } from "discord.js";

export async function handlePingCommand(message: Message) {
  await message.reply("Pong! 🏓");
}
