import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES } from "../constants";

export const BookmarkEntitySchema = z
  .object({
    id: z.cuid2().openapi({
      description: "Unique identifier for the bookmark.",
      title: "Bookmark ID",
    }),
    createdAt: z.coerce.date().optional().openapi({
      description: "Timestamp when the bookmark was created.",
      title: "Created At",
    }),
    userId: z.cuid2().openapi({
      description: "Identifier of the user who created the bookmark.",
      title: "User ID",
    }),
    parentId: z.cuid2().openapi({
      description: "Identifier of the parent entity that was bookmarked.",
      title: "Parent ID",
    }),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).openapi({
      description: "Type of the parent entity this statistic belongs to.",
      title: "Parent Type",
    }),
  })
  .openapi({
    title: "Bookmark",
    description: "Represents a user bookmark on a specific parent entity.",
  });

export const BookmarkInputSchema = z.object({
  parentId: z.string(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES),
  userId: z.string(),
});

export const BookmarkOutputSchema = BookmarkEntitySchema;
