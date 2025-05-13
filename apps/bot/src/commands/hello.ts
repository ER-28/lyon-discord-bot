import type { Message } from "discord.js";

export async function handleHelloCommand(message: Message) {
  await message.reply(`Hello, ${message.author.username}!`);
}
