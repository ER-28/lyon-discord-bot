import { type Client, Events } from "discord.js";
import { handleChannelCreate } from "./database_sync/handleChannelCreate.js";
import { handleChannelDelete } from "./database_sync/handleChannelDelete.js";
import { handleChannelUpdate } from "./database_sync/handleChannelUpdate.js";
import { handleGuildMemberAdd } from "./guildMemberAdd.js";
import { handleMessageCreate } from "./messageCreate.js";
import { handleMessageReactionAdd } from "./messageReactionAdd.js";
import { handleReady } from "./ready.js";

export function registerEvents(client: Client) {
  client.once(Events.ClientReady, handleReady);
  client.on(Events.MessageCreate, handleMessageCreate);
  client.on(Events.GuildMemberAdd, handleGuildMemberAdd);
  client.on(Events.MessageReactionAdd, handleMessageReactionAdd);
  client.on(Events.ChannelCreate, handleChannelCreate);
  client.on(Events.ChannelUpdate, handleChannelUpdate);
  client.on(Events.ChannelDelete, handleChannelDelete);
}
