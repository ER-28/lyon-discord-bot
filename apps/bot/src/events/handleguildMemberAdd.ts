import type { GuildMember } from "discord.js";
import { Arrivals } from "../services/arrivals.js";

export async function handleGuildMemberAdd(member: GuildMember) {
  await new Arrivals().handleGuildMemberAdd(member);
}
