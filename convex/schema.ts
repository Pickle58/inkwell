import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  knowledgeItems: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_document", ["documentId"]),
  chatMessages: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_document", ["documentId"]),
  subscriptions: defineTable({
    email: v.string(),
    polarSubscriptionId: v.string(),
    polarCustomerId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.union(v.number(), v.null()),
    trialEnd: v.union(v.number(), v.null()),
    cancelAtPeriodEnd: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_polar_subscription_id", ["polarSubscriptionId"]),
});
