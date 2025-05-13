import { connectDatabase } from "@repo/database/utils/connect";
import { Client } from "discord.js";
import { config } from "./config/config.js";
import { botIntents } from "./config/intent.js";
import { registerEvents } from "./events/index.js";

// Set up client with required intents
export async function initializeBot() {
  // connect to the database
  await connectDatabase("mongodb://root:example@localhost:27017");

  const client = new Client({
    intents: botIntents,
  });

  // Register all event handlers
  registerEvents(client);

  // Login with token from config
  await client.login(config.token);

  return client;
}
