import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwnedDocument, requireUserId } from "./lib/ownership";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);
    return documents;
  },
});

export const get = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      return null;
    }
    return document;
  },
});

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    return await ctx.db.insert("documents", {
      userId,
      title: "Untitled",
      content: "<p></p>",
      updatedAt: now,
    });
  },
});

export const updateTitle = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.documentId);
    const title = args.title.trim() || "Untitled";
    await ctx.db.patch(args.documentId, {
      title,
      updatedAt: Date.now(),
    });
  },
});

export const updateContent = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.documentId);
    await ctx.db.patch(args.documentId, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});
