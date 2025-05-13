import { initializeBot } from "./bot.js";

initializeBot().then(
  (client) => {
    process.on("unhandledRejection", (error) => {
      console.error("Unhandled promise rejection:", error);
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);

      // Attempt to gracefully shutdown in case of critical errors
      client.destroy().then(() => console.log("Client destroyed"));

      process.exit(1);
    });

    return client;
  },
  (error) => {
    console.error("Failed to initialize bot:", error);
    process.exit(1);
  },
);
