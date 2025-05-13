import type { Client } from "discord.js";

/**
 * Event handler for when the bot is ready
 * @param {import('discord.js').Client} client - Discord.js client
 */
export function handleReady(client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);
}
