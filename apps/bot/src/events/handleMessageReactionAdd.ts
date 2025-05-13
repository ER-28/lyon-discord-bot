import type {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { ArrivalsService } from "../services/arrivalsService.js";

export async function handleMessageReactionAdd(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
) {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Error fetching reaction:", error);
      return;
    }
  }

  if (reaction.emoji.name === "✅") {
    await new ArrivalsService().handleApprovalReaction(reaction, user);
  }
}
