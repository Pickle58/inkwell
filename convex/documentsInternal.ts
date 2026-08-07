import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const updateContent = internalMutation({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== args.userId) {
      throw new Error("Document not found");
    }
    await ctx.db.patch(args.documentId, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});
