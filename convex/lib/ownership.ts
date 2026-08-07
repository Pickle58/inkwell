import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function requireUserId(ctx: Ctx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Not authenticated");
  }
  return userId;
}

export async function requireOwnedDocument(
  ctx: Ctx,
  documentId: Id<"documents">,
) {
  const userId = await requireUserId(ctx);
  const document = await ctx.db.get(documentId);
  if (!document || document.userId !== userId) {
    throw new Error("Document not found");
  }
  return { userId, document };
}
