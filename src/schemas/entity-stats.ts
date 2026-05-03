import { z } from "@hono/zod-openapi";

import { ACTIVITY_PARENT_TYPES } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const EntityStatsShape = z.object({
  parentId: z.cuid2(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES),

  likesCount: z.number(),
  bookmarksCount: z.number(),
  viewsCount: z.number(),
  commentsCount: z.number(),
});

export type EntityStatsShapeType = z.infer<typeof EntityStatsShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const EntityStatsEntitySchema = z
  .object({
    ...EntityStatsShape.shape,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("EntityStats");

export type EntityStatsEntity = z.infer<typeof EntityStatsEntitySchema>;
