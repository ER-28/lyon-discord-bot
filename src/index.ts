import { initializeBot } from "./bot.js";

// Start the bot and handle any errors
try {
  const client = initializeBot();

  // Global error handlers
  process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);

    // Attempt to gracefully shutdown in case of critical errors
    client.destroy().then(() => console.log("Client destroyed"));

    process.exit(1);
  });
} catch (error) {
  console.error("Failed to start bot:", error);
  process.exit(1);
}
