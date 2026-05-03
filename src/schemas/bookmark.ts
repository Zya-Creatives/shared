import { z } from "@hono/zod-openapi";

import { ACTIVITY_PARENT_TYPES } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const BookmarkShape = z.object({
  parentId: z.cuid2(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES),
});

export type BookmarkShapeType = z.infer<typeof BookmarkShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const BookmarkEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),
    ...BookmarkShape.shape,
    createdAt: z.iso.datetime(),
  })
  .openapi("Bookmark");

export type BookmarkEntity = z.infer<typeof BookmarkEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateBookmarkInputSchema = BookmarkShape.extend({});

export type CreateBookmarkInput = z.infer<typeof CreateBookmarkInputSchema>;

export const DeleteBookmarkInputSchema = BookmarkShape.extend({});

export type DeleteBookmarkInput = z.infer<typeof DeleteBookmarkInputSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const BookmarkOutputSchema = BookmarkEntitySchema;

export type BookmarkOutput = z.infer<typeof BookmarkOutputSchema>;
