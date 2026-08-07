import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireOwnedDocument } from "./lib/ownership";

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.documentId);
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .take(100);
    return messages;
  },
});

export const clear = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.documentId);
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .take(100);
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

export const appendMessages = internalMutation({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    userContent: v.string(),
    assistantContent: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("chatMessages", {
      documentId: args.documentId,
      userId: args.userId,
      role: "user",
      content: args.userContent,
      createdAt: now,
    });
    await ctx.db.insert("chatMessages", {
      documentId: args.documentId,
      userId: args.userId,
      role: "assistant",
      content: args.assistantContent,
      createdAt: now + 1,
    });
  },
});
