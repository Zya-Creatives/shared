import { z } from "@hono/zod-openapi";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const FeedTagsShape = z.object({
  tags: z.array(z.string()),
});

export type FeedTagsShapeType = z.infer<typeof FeedTagsShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const FeedTagsEntitySchema = z
  .object({
    userId: z.cuid2(),
    ...FeedTagsShape.shape,
  })
  .openapi("FeedTags");

export type FeedTagsEntity = z.infer<typeof FeedTagsEntitySchema>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */

export const TrendingUserSchema = z.object({
  creatorId: z.cuid2(),
  creatorUsername: z.string(),
  creatorName: z.string(),
  creatorImageUrl: z.url(),
  isFollowing: z.boolean().optional(),
  followsYou: z.boolean().optional(),
});

export type TrendingUser = z.infer<typeof TrendingUserSchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const UpdateFeedTagsInputSchema = FeedTagsShape.extend({});

export type UpdateFeedTagsInput = z.infer<typeof UpdateFeedTagsInputSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const FeedTagsOutputSchema = FeedTagsEntitySchema;

export type FeedTagsOutput = z.infer<typeof FeedTagsOutputSchema>;

export const TrendingUsersOutputSchema = z.object({
  creators: z.array(TrendingUserSchema),
});

export type TrendingUsersOutput = z.infer<typeof TrendingUsersOutputSchema>;

export const FeedTagsInputSchema = z.object({
  tags: z.array(z.string().min(1)).default([]),
});

export const FeedTagsSchema = z.object({
  userId: z.cuid2(),
  tags: z.array(z.string()),
});

export type FeedTagsInput = z.infer<typeof FeedTagsInputSchema>;