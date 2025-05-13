import type { GuildMember } from "discord.js";
import { ArrivalsService } from "../services/arrivalsService.js";

export async function handleGuildMemberAdd(member: GuildMember) {
  await new ArrivalsService().handleGuildMemberAdd(member);
}
