import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES } from "../constants";

export const EntityStatsSchema = z
  .object({
    updatedAt: z.coerce.date().optional().openapi({
      description: "Timestamp of the last update to the entity statistics.",
      title: "Updated At",
    }),
    createdAt: z.coerce.date().optional().openapi({
      description: "Timestamp of the creationn to the entity statistics.",
      title: "Updated At",
    }),
    parentId: z.cuid2().openapi({
      description:
        "Unique identifier of the parent entity (e.g., project, post, etc.).",
      title: "Parent ID",
    }),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).openapi({
      description: "Type of the parent entity this statistic belongs to.",
      title: "Parent Type",
    }),
    likesCount: z.number().openapi({
      description: "Total number of likes associated with the entity.",
      title: "Likes Count",
    }),
    bookmarksCount: z.number().openapi({
      description: "Total number of bookmarks associated with the entity.",
      title: "Bookmarks Count",
    }),
    viewsCount: z.number().openapi({
      description: "Total number of views recorded for the entity.",
      title: "Views Count",
    }),
    commentsCount: z.number().openapi({
      description: "Total number of comments linked to the entity.",
      title: "Comments Count",
    }),
  })
  .openapi({
    description: "Represents engagement statistics for a specific entity.",
    title: "EntityStats",
  });
