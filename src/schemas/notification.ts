import { z } from "@hono/zod-openapi";

import { ACTIVITY_PARENT_TYPES, NOTIFICATION_TYPES } from "../constants";
import { MinimalUserSchema } from "./minimal-user";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const NotificationShape = z.object({
  actorId: z.cuid2(),
  recipientId: z.cuid2(),
  type: z.enum(NOTIFICATION_TYPES),

  entityId: z.cuid2().optional(),
  parentId: z.cuid2().nullable().optional(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).nullable().optional(),

  rootId: z.cuid2(),
  rootType: z.enum(ACTIVITY_PARENT_TYPES),
});

export type NotificationShapeType = z.infer<typeof NotificationShape>;

/**
 * --------------------------------
 * ENTITY
 * --------------------------------
 */

export const NotificationEntitySchema = z
  .object({
    id: z.cuid2(),
    ...NotificationShape.shape,
    isRead: z.boolean().default(false),
    createdAt: z.iso.datetime(),
    deletedAt: z.iso.datetime().optional(),
  })
  .openapi("Notification");

export type NotificationEntity = z.infer<typeof NotificationEntitySchema>;

export const NotificationDetailsEntitySchema = NotificationEntitySchema.extend({
  actor: MinimalUserSchema,
  recipient: MinimalUserSchema,
  itemTitle: z.string().optional(),
  itemContent: z.string().optional(),
  itemImgUrl: z.string().optional(),
  itemStatus: z.string().optional(),
});

export type NotificationDetailsEntity = z.infer<
  typeof NotificationDetailsEntitySchema
>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const ListNotificationsInputSchema = z.object({
  type: z.enum(NOTIFICATION_TYPES).optional(),
  cursor: z.string().optional(),
  unreadOnly: z.boolean().optional().default(false),
});

export type ListNotificationsInput = z.infer<
  typeof ListNotificationsInputSchema
>;

export const MarkReadInputSchema = z.object({
  notificationIds: z.array(z.cuid2()).min(1),
});

export type MarkReadInput = z.infer<typeof MarkReadInputSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const ListNotificationsOutputSchema = z.object({
  notifications: z.array(NotificationDetailsEntitySchema),
  nextCursor: z.string().optional(),
  unreadCount: z.int(),
});

export type ListNotificationsOutput = z.infer<
  typeof ListNotificationsOutputSchema
>;

export const NotificationCountOutputSchema = z.object({
  unreadCount: z.int(),
});

export type NotificationCountOutput = z.infer<
  typeof NotificationCountOutputSchema
>;
