import { configDotenv } from "dotenv";
import { type Config, configSchema } from "../interfaces/config.js";

configDotenv();

export const config: Config = configSchema.parse({
  token: process.env.TOKEN,
  roles: {
    admin: process.env.ADMIN_ROLE,
    member: process.env.MEMBER_ROLE,
  },
  channels: {
    presentation: process.env.PRESENTATION_CHANNEL,
  },
  welcome: {
    deleteDelay: Number.parseInt(process.env.WELCOME_DELETE_DELAY || "", 10),
  },
});
