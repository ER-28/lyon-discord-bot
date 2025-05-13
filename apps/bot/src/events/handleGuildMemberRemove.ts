import type { GuildMember, PartialGuildMember } from "discord.js";
import { Arrivals } from "../services/arrivals.js";

export async function handleGuildMemberRemove(
  member: GuildMember | PartialGuildMember,
) {
  await new Arrivals().handleGuildMemberRemove(member);
}
