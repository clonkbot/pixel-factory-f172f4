import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) return null;

    // Refresh the URL if we have a storageId
    if (video.storageId) {
      const url = await ctx.storage.getUrl(video.storageId);
      return { ...video, videoUrl: url };
    }
    return video;
  },
});

export const create = mutation({
  args: {
    prompt: v.string(),
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const videoId = await ctx.db.insert("videos", {
      userId,
      prompt: args.prompt,
      status: "generating",
      aspectRatio: args.aspectRatio,
      createdAt: Date.now(),
    });

    return videoId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("videos"),
    status: v.union(
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    storageId: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) {
      throw new Error("Video not found");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      storageId: args.storageId,
      videoUrl: args.videoUrl,
      errorMessage: args.errorMessage,
      completedAt: args.status === "completed" ? Date.now() : undefined,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) {
      throw new Error("Video not found");
    }

    // Delete from storage if exists
    if (video.storageId) {
      await ctx.storage.delete(video.storageId);
    }

    await ctx.db.delete(args.id);
  },
});

export const generateVideo = action({
  args: {
    videoId: v.id("videos"),
    prompt: v.string(),
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
  },
  handler: async (ctx, args) => {
    try {
      // Add Pixar-style keywords to the prompt
      const enhancedPrompt = `Pixar-style 3D animated scene: ${args.prompt}. High quality CGI animation, colorful, family-friendly, smooth motion, cinematic lighting, cute characters with expressive faces.`;

      const result = await ctx.runAction(api.ai.generateVideo, {
        prompt: enhancedPrompt,
        aspectRatio: args.aspectRatio,
      });

      if (result && result.storageId) {
        await ctx.runMutation(api.videos.updateStatus, {
          id: args.videoId,
          status: "completed",
          storageId: result.storageId,
          videoUrl: result.url ?? undefined,
        });
      } else {
        throw new Error("Video generation returned no result");
      }
    } catch (error) {
      await ctx.runMutation(api.videos.updateStatus, {
        id: args.videoId,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});
