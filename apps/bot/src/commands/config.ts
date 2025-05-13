import type { IConfig } from "@repo/database/models/config";
import type { Message } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import { ConfigService } from "../services/configService.js";

export async function handleConfigCommand(message: Message) {
  // Check if the command is used in a server
  if (message.guild === null) {
    return message.reply("This command can only be used in a server.");
  }

  // Ignore messages from bots
  if (message.author.bot) {
    return;
  }

  // Check if the user has administrator permissions
  const member = message.member;
  if (!member?.permissions.has(PermissionFlagsBits.Administrator)) {
    return message.reply(
      "You need to have administrator permissions to use this command.",
    );
  }

  const args = message.content.split(" ");

  // Remove the prefix and command part (!config)
  args.shift();

  const action = args[0]?.toLowerCase();
  const key = args[1];
  const value = args.slice(2).join(" "); // Join remaining arguments as value

  const configService = new ConfigService();

  try {
    switch (action) {
      case "set":
        if (!key) {
          return message.reply(
            "Please provide a key to set (e.g., roles.admin, channel.welcome)",
          );
        }

        if (!value) {
          return message.reply("Please provide a value to set.");
        }

        await configService.setConfigValue(message.guild, key, value);
        return message.reply(
          `✅ Configuration \`${key}\` has been set to \`${value}\``,
        );

      case "get": {
        if (!key) {
          // Return all configuration
          const fullConfig = await configService.getGuildConfig(message.guild);
          const configDisplay = formatConfig(fullConfig);
          return message.reply(`**Current Configuration:**\n${configDisplay}`);
        }

        // Return specific key
        const configValue = await configService.getConfigValue(
          message.guild,
          key,
        );
        if (configValue === null) {
          return message.reply(`Configuration \`${key}\` is not set.`);
        }
        return message.reply(
          `Configuration \`${key}\` is set to \`${configValue}\``,
        );
      }

      case "reset":
        if (!key) {
          return message.reply("Please provide a key to reset.");
        }

        await configService.resetConfigValue(message.guild, key);
        return message.reply(`✅ Configuration \`${key}\` has been reset.`);

      case "help":
        return message.reply(getHelpMessage());

      default:
        return message.reply(
          'Unknown command. Use "!config help" to see available commands.',
        );
    }
  } catch (error: unknown) {
    console.error("Error in config command:", error);
    if (error instanceof Error) {
      return message.reply(`Error: ${error.message.toString()}`);
    }
  }
}

/**
 * Format config object for display
 */
function formatConfig(config: IConfig): string {
  let output = "```\n";

  // Channel settings
  output += "Channels:\n";
  output += `  presentation: ${config.channel.presentation || "(not set)"}\n`;
  output += `  welcome: ${config.channel.welcome || "(not set)"}\n`;

  // Role settings
  output += "\nRoles:\n";
  output += `  admin: ${config.roles.admin || "(not set)"}\n`;
  output += `  member: ${config.roles.member || "(not set)"}\n`;

  output += "```";
  return output;
}

/**
 * Get help message for the config command
 */
function getHelpMessage(): string {
  return `**Config Command Help**
  
Commands:
\`!config set <key> <value>\` - Set a configuration value
\`!config get [key]\` - Get a specific configuration value or all values if no key is provided
\`!config reset <key>\` - Reset a configuration value to default
\`!config help\` - Show this help message

Available Keys:
- \`channel.presentation\` - Channel for presentations
- \`channel.welcome\` - Channel for welcome messages
- \`roles.admin\` - Admin role ID
- \`roles.member\` - Member role ID

Examples:
\`!config set roles.admin 123456789012345678\`
\`!config get channel.welcome\`
\`!config reset roles.member\``;
}
