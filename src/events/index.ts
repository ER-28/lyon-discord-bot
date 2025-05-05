import { type Client, Events } from "discord.js";
import { handleGuildMemberAdd } from "./guildMemberAdd.js";
import { handleMessageCreate } from "./messageCreate.js";
import { handleMessageReactionAdd } from "./messageReactionAdd.js";
import { handleReady } from "./ready.js";

export function registerEvents(client: Client) {
  client.once(Events.ClientReady, handleReady);
  client.on(Events.MessageCreate, handleMessageCreate);
  client.on(Events.GuildMemberAdd, handleGuildMemberAdd);
  client.on(Events.MessageReactionAdd, handleMessageReactionAdd);
}
