import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { requireOwnedDocument } from "./lib/ownership";

export const loadAssistContext = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const { userId, document } = await requireOwnedDocument(
      ctx,
      args.documentId,
    );
    const knowledge = await ctx.db
      .query("knowledgeItems")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .take(50);
    const recentMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .take(20);
    return {
      userId,
      document,
      knowledge,
      recentMessages: recentMessages.reverse(),
    };
  },
});
