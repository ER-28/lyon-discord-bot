import {configDotenv} from "dotenv";

configDotenv()

if (!process.env.CLIENT_ID) {
  throw new Error('Missing DISCORD_CLIENT_ID environment variable');
}

if (!process.env.TOKEN) {
  throw new Error('Missing DISCORD_TOKEN environment variable');
}

export const config = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
}