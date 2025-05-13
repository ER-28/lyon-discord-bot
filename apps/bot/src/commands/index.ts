import type { Message } from "discord.js";
import { handleHelloCommand } from "./hello.js";
import { handlePingCommand } from "./ping.js";
import { handleRulesCommand } from "./rules.js";

const COMMANDS: {
  [key: string]: (message: Message) => Promise<void> | void;
} = {
  "!ping": handlePingCommand,
  "!hello": handleHelloCommand,
  "!rules": handleRulesCommand,
};

export async function handleCommands(message: Message) {
  // Get the command by finding the first word with ! prefix
  const [command] = message.content.split(" ");

  // Check if command exists and execute handler
  const handler = COMMANDS[command];
  if (handler) {
    try {
      await handler(message);
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
      await message.reply("There was an error executing that command.");
    }
  }
}
