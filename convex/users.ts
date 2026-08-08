import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/ownership";

const MAX_NAME_LENGTH = 100;

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return {
      _id: user._id,
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? null,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const name = args.name.trim();
    if (name.length > MAX_NAME_LENGTH) {
      throw new Error(`Name must be ${MAX_NAME_LENGTH} characters or fewer`);
    }
    await ctx.db.patch(userId, { name });
  },
});
