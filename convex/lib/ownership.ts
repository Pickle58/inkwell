import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import {
  hasSubscriptionAccess,
  normalizeEmail,
} from "./subscriptionAccess";

type Ctx = QueryCtx | MutationCtx;

export async function requireUserId(ctx: Ctx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Not authenticated");
  }
  return userId;
}

export async function requireSubscribedUserId(ctx: Ctx): Promise<Id<"users">> {
  const userId = await requireUserId(ctx);
  const user = await ctx.db.get(userId);
  const email = user?.email ? normalizeEmail(user.email) : "";
  if (!email) {
    throw new Error("Subscription required");
  }

  const subscriptions = await ctx.db
    .query("subscriptions")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();

  const entitled = subscriptions.some((subscription) =>
    hasSubscriptionAccess(subscription.status),
  );
  if (!entitled) {
    throw new Error("Subscription required");
  }

  return userId;
}

export async function requireOwnedDocument(
  ctx: Ctx,
  documentId: Id<"documents">,
) {
  const userId = await requireSubscribedUserId(ctx);
  const document = await ctx.db.get(documentId);
  if (!document || document.userId !== userId) {
    throw new Error("Document not found");
  }
  return { userId, document };
}
