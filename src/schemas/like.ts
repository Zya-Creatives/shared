import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES } from "../constants";

export const LikeEntitySchema = z
  .object({
    id: z.cuid2().openapi({
      description: "The unique CUID2 identifier for the comment.",
      example: "tr4q2k7k0000c7625z2k8ggy",
    }),
    createdAt: z.coerce.date().optional().openapi({
      description: "Timestamp when the like was created.",
      title: "Created At",
    }),
    userId: z.cuid2().openapi({
      description: "Identifier of the user who performed the like.",
      title: "User ID",
    }),
    parentId: z.cuid2().openapi({
      description: "Identifier of the parent entity that was liked.",
      title: "Parent ID",
    }),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).openapi({
      description: "Type of the parent entity this statistic belongs to.",
      title: "Parent Type",
    }),
  })
  .openapi({
    description: "Represents a single like event on a parent entity.",
    title: "Like",
  });

export const LikeInputSchema = z.object({
  parentId: z.string(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES),
  userId: z.string(),
});

export const LikeOutputSchema = LikeEntitySchema;
