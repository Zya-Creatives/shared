import { z } from "@hono/zod-openapi";

export const FeedTagsSchema = z.object({
  userId: z.cuid2(),
  tags: z.array(z.string()),
});

export const FeedTagsInputSchema = z.object({
  tags: z.array(z.string()),
});

