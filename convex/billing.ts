import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { requireUserId } from "./lib/ownership";
import {
  hasSubscriptionAccess,
  normalizeEmail,
  toMillis,
} from "./lib/subscriptionAccess";

export const isSubscribed = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await ctx.db.get(userId);
    const email = user?.email ? normalizeEmail(user.email) : "";
    if (!email) {
      return false;
    }

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    return subscriptions.some((subscription) =>
      hasSubscriptionAccess(subscription.status),
    );
  },
});

export const upsertSubscriptionFromPolar = internalMutation({
  args: {
    email: v.string(),
    polarSubscriptionId: v.string(),
    polarCustomerId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.union(v.number(), v.null()),
    trialEnd: v.union(v.number(), v.null()),
    cancelAtPeriodEnd: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    if (!email) {
      return null;
    }

    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_polar_subscription_id", (q) =>
        q.eq("polarSubscriptionId", args.polarSubscriptionId),
      )
      .unique();

    const patch = {
      email,
      polarSubscriptionId: args.polarSubscriptionId,
      polarCustomerId: args.polarCustomerId,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
      trialEnd: args.trialEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("subscriptions", patch);
    }

    return null;
  },
});

export function subscriptionFieldsFromPolar(data: {
  id: string;
  status: string;
  customerId: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd?: Date | string | number | null;
  trialEnd?: Date | string | number | null;
  customer?: { email?: string | null } | null;
}) {
  return {
    email: data.customer?.email ?? "",
    polarSubscriptionId: data.id,
    polarCustomerId: data.customerId,
    status: data.status,
    currentPeriodEnd: toMillis(data.currentPeriodEnd),
    trialEnd: toMillis(data.trialEnd),
    cancelAtPeriodEnd: data.cancelAtPeriodEnd,
  };
}
