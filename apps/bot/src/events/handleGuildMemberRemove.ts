import type { GuildMember, PartialGuildMember } from "discord.js";
import { ArrivalsService } from "../services/arrivalsService.js";

export async function handleGuildMemberRemove(
  member: GuildMember | PartialGuildMember,
) {
  await new ArrivalsService().handleGuildMemberRemove(member);
}
