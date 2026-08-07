import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwnedDocument } from "./lib/ownership";

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.documentId);
    return await ctx.db
      .query("knowledgeItems")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .take(50);
  },
});

export const add = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireOwnedDocument(ctx, args.documentId);
    const title = args.title.trim();
    const body = args.body.trim();
    if (!title || !body) {
      throw new Error("Title and body are required");
    }
    return await ctx.db.insert("knowledgeItems", {
      documentId: args.documentId,
      userId,
      title,
      body,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { knowledgeId: v.id("knowledgeItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.knowledgeId);
    if (!item) {
      throw new Error("Knowledge item not found");
    }
    await requireOwnedDocument(ctx, item.documentId);
    await ctx.db.delete(args.knowledgeId);
  },
});
