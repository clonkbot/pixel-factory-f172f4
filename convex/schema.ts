import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  videos: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    status: v.union(
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    storageId: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.string()),
    thumbnailBase64: v.optional(v.string()),
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_created", ["createdAt"]),

  prompts: defineTable({
    userId: v.id("users"),
    text: v.string(),
    category: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
