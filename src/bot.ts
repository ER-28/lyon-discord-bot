import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config/config.js";
import { botIntents } from "./config/intent.js";
import { registerEvents } from "./events/index.js";

// Set up client with required intents
export function initializeBot() {
  const client = new Client({
    intents: botIntents,
  });

  // Register all event handlers
  registerEvents(client);

  // Login with token from config
  client
    .login(config.token)
    .then(() => {
      console.log("Start successfully!");
    })
    .catch((err) => {
      console.error("Failed to log in:", err);
      throw err;
    });

  return client;
}
