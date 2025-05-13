import {
  Config as ConfigRepo,
  type IConfig,
} from "@repo/database/models/config";
import type { Guild } from "discord.js";

export class ConfigService {
  /**
   * Get the configuration for a guild
   * @param guild Discord guild
   * @returns Guild configuration
   */
  async getGuildConfig(guild: Guild): Promise<IConfig> {
    const config = await ConfigRepo.findOne({ guildId: guild.id });
    if (!config) {
      // Create default configuration if none exists
      const newConfig = new ConfigRepo({
        guildId: guild.id,
        channel: {
          presentation: null,
          welcome: null,
        },
        roles: {
          admin: null,
          member: null,
        },
      });
      await newConfig.save();
      return newConfig;
    }
    return config;
  }

  /**
   * Set a specific configuration value for a guild
   * @param guild Discord guild
   * @param key Configuration key path (e.g., "roles.admin" or "channel.welcome")
   * @param value Value to set
   * @returns Updated configuration
   */
  async setConfigValue(
    guild: Guild,
    key: string,
    value: string | null,
  ): Promise<IConfig> {
    // Find the config for this guild
    let config = await ConfigRepo.findOne({ guildId: guild.id });

    // Create default config if none exists
    if (!config) {
      config = new ConfigRepo({
        guildId: guild.id,
        channel: {
          presentation: null,
          welcome: null,
        },
        roles: {
          admin: null,
          member: null,
        },
      });
    }

    // Update the specific field based on the key path
    const keyParts = key.split(".");
    if (keyParts.length === 2) {
      const [category, subKey] = keyParts;

      // Type safety check
      if (
        category === "channel" &&
        (subKey === "presentation" || subKey === "welcome")
      ) {
        config.channel[subKey] = value;
      } else if (
        category === "roles" &&
        (subKey === "admin" || subKey === "member")
      ) {
        config.roles[subKey] = value;
      } else {
        throw new Error(`Invalid configuration key: ${key}`);
      }
    } else {
      throw new Error(
        `Invalid key format. Use format "category.key" (e.g., "roles.admin")`,
      );
    }

    // Save the updated config
    await config.save();
    return config;
  }

  /**
   * Reset a specific configuration value to null
   * @param guild Discord guild
   * @param key Configuration key path to reset
   * @returns Updated configuration
   */
  async resetConfigValue(guild: Guild, key: string): Promise<IConfig> {
    return this.setConfigValue(guild, key, null);
  }

  /**
   * Get a specific configuration value
   * @param guild Discord guild
   * @param key Configuration key path
   * @returns Value at the specified key path
   */
  async getConfigValue(
    guild: Guild,
    key: string,
  ): Promise<string | null | undefined> {
    const config = await this.getGuildConfig(guild);
    const keyParts = key.split(".");

    if (keyParts.length === 2) {
      const [category, subKey] = keyParts;

      if (
        category === "channel" &&
        (subKey === "presentation" || subKey === "welcome")
      ) {
        return config.channel[subKey];
      }
      if (category === "roles" && (subKey === "admin" || subKey === "member")) {
        return config.roles[subKey];
      }
    }

    return null;
  }
}
