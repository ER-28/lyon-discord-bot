import type {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { config } from "../config/config.js";
import { presentationChannelCloseMessage } from "../messages/presentation-channel-close.js";
import { presentationMessages } from "../messages/presentation.js";
import { Arrivals } from "../services/arrivals.js";
import {
  type WelcomeChannelData,
  getWelcomeChannel,
  removeWelcomeChannel,
} from "../utils/welcomeManager.js";

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
    await new Arrivals().handleApprovalReaction(reaction, user);
  }
}
