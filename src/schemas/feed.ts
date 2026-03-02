import { z } from "@hono/zod-openapi";
import { MinimalUserSchema } from "./user";

export const FeedTagsSchema = z.object({
  userId: z.cuid2(),
  tags: z.array(z.string()),
});

export const FeedTagsInputSchema = z.object({
  tags: z.array(z.string()),
});

export const TrendingUsersOutputSchema = z.object({
  creators: z.array(
    z.object({
      creatorUsername: z.string(),
      creatorName: z.string(),
      creatorId: z.cuid2(),
      creatorImageUrl: z.url(),
      isFollowing: z.boolean().optional(),
      followsYou: z.boolean().optional(),
    }),
  ),
});
