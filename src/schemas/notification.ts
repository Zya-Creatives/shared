import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES, NOTIFICATION_TYPES } from "../constants";

export const NotificationEntitySchema = z
  .object({
    id: z.cuid2().openapi({ example: "not_cksd0v6q0000s9a5y8z7p3x9" }),
    recipientId: z.cuid2().openapi({ example: "user_recipient_123" }),
    actorId: z.cuid2().openapi({ example: "user_actor_456" }),
    type: z.enum(NOTIFICATION_TYPES).openapi({ example: "LIKE" }),
    // 1. ENTITY: The specific thing created (e.g., the Reply)
    entityId: z.cuid2().optional().openapi({ example: "entity_789" }),

    // 2. PARENT: The direct context (e.g., the Comment being replied to)
    // Optional because top-level interactions (like a comment on a project)
    // have no parent other than the root.
    parentId: z
      .cuid2()
      .optional()
      .nullable()
      .openapi({ example: "parent_456" }),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).optional().nullable(),

    // 3. ROOT: The top-level container (e.g., the Project)
    rootId: z.cuid2().openapi({ example: "root_123" }),
    rootType: z.enum(ACTIVITY_PARENT_TYPES),

    isRead: z.boolean().default(false).openapi({ example: false }),
    createdAt: z.coerce.date().openapi({ example: "2026-01-05T09:00:00.000Z" }),
    deletedAt: z.coerce.date().optional().nullable(),
  })
  .openapi("NotificationEntity");

export const MinimalNotificationEntitySchema = z.object({
  id: z.cuid2(),
  recipientId: z.cuid2(),
  actorId: z.cuid2(),
});

export const NotificationDetailsEntitySchema = NotificationEntitySchema.extend({
  itemTitle: z.string().optional(),
  itemContent: z.string().optional(),
  itemImgUrl: z.string().optional(),
  itemStatus: z.string().optional(),
});

export const ListNotificationsInputSchema = z
  .object({
    type: z.enum(NOTIFICATION_TYPES).openapi({ example: "LIKE" }).optional(),
    cursor: z.string().optional(),
    unreadOnly: z
      .preprocess((val) => val === "true" || val === true, z.boolean())
      .optional()
      .default(false),
  })
  .openapi("ListNotificationsInput");

export const ListNotificationsOutputSchema = z.object({
  notifications: z.array(NotificationDetailsEntitySchema),
  nextCursor: z.string().optional().nullable(),
  unreadCount: z.number().int().openapi({ example: 5 }),
});

export const MarkReadInputSchema = z.object({
  notificationIds: z.array(z.cuid2()).min(1),
});

export const NotificationCountOutputSchema = z.object({
  unreadCount: z.number().int().openapi({ example: 12 }),
});
