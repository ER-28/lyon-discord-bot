import { configDotenv } from "dotenv";
import { type Config, configSchema } from "../interfaces/config.js";

configDotenv();

export const config: Config = configSchema.parse({
  token: process.env.TOKEN,
  mongoUri: process.env.MONGO_URI,
  roles: {
    admin: process.env.ADMIN_ROLE,
    member: process.env.MEMBER_ROLE,
  },
  channels: {
    presentation: process.env.PRESENTATION_CHANNEL,
  },
});
