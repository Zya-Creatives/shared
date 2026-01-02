import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES } from "../constants";
export const UserStrikeEntitySchema = z.object({
  userId: z.cuid2(),
  strikeCount: z.int().nonnegative().default(0),
  isSuspended: z.boolean(),
  suspensionExpiresAt: z.coerce.date().optional(),
  parentId: z.cuid2(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).optional(),
  lastReason: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const UpsertUserStrikeInputSchema = z.object({
  userId: z.cuid2(),
  parentId: z.cuid2(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).optional(),
});

export const UpsertUserStrikeOutputSchema = UserStrikeEntitySchema;
