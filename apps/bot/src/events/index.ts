import { type Client, Events } from "discord.js";
import { handleChannelCreate } from "./database_sync/handleChannelCreate.js";
import { handleChannelDelete } from "./database_sync/handleChannelDelete.js";
import { handleChannelUpdate } from "./database_sync/handleChannelUpdate.js";
import { handleClientReady } from "./handleClientReady.js";
import { handleGuildMemberRemove } from "./handleGuildMemberRemove.js";
import { handleMessageCreate } from "./handleMessageCreate.js";
import { handleMessageReactionAdd } from "./handleMessageReactionAdd.js";
import { handleGuildMemberAdd } from "./handleguildMemberAdd.js";

export function registerEvents(client: Client) {
  client.once(Events.ClientReady, handleClientReady);
  client.on(Events.MessageCreate, handleMessageCreate);
  client.on(Events.GuildMemberAdd, handleGuildMemberAdd);
  client.on(Events.GuildMemberRemove, handleGuildMemberRemove);
  client.on(Events.MessageReactionAdd, handleMessageReactionAdd);
  client.on(Events.ChannelCreate, handleChannelCreate);
  client.on(Events.ChannelUpdate, handleChannelUpdate);
  client.on(Events.ChannelDelete, handleChannelDelete);
}
