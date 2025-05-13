import { Config, type IConfig } from "@repo/database/models/config";
import type { Guild } from "discord.js";

export async function getGuildConfig(guild: Guild): Promise<IConfig> {
  const config = await Config.findOne({ guild_id: guild.id });
  if (!config) {
    const newConfig = new Config({
      guild_id: guild.id,
      roles: {
        admin: null,
        member: null,
      },
      channels: {
        presentation: null,
      },
    });
    await newConfig.save();
    return newConfig;
  }
  return config;
}
