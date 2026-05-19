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
    archivedAt: z.iso.datetime().optional(),
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

export const NotificationTabSchema = z.enum([
  "all",
  "following",
  "likes",
  "comments",
  "archived",
]);

export type NotificationTab = z.infer<typeof NotificationTabSchema>;

export const NotificationActionSchema = z.object({
  label: z.string(),
  variant: z.enum(["primary", "secondary", "link"]).default("secondary"),
  href: z.string().optional(),
  action: z
    .enum([
      "open",
      "openConversation",
      "viewApplication",
      "reviewProject",
      "retryVerification",
      "viewProduct",
      "exploreOpportunities",
    ])
    .default("open"),
});

export type NotificationAction = z.infer<typeof NotificationActionSchema>;

export const NotificationPreviewSchema = z.object({
  kind: z.enum(["none", "text", "media", "job", "system"]).default("none"),
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  href: z.string().optional(),
  status: z.string().optional(),
  owner: MinimalUserSchema.optional(),
});

export type NotificationPreview = z.infer<typeof NotificationPreviewSchema>;

export const NotificationFeedItemSchema = z
  .object({
    id: z.string(),
    notificationIds: z.array(z.cuid2()).min(1),
    type: z.enum(NOTIFICATION_TYPES),
    tab: NotificationTabSchema,
    actor: MinimalUserSchema,
    actors: z.array(MinimalUserSchema).min(1),
    actorCount: z.int().nonnegative(),
    otherActorCount: z.int().nonnegative(),
    recipientId: z.cuid2(),
    entityId: z.cuid2().optional(),
    parentId: z.cuid2().nullable().optional(),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).nullable().optional(),
    rootId: z.cuid2(),
    rootType: z.enum(ACTIVITY_PARENT_TYPES),
    createdAt: z.iso.datetime(),
    archivedAt: z.iso.datetime().optional(),
    isRead: z.boolean(),
    headline: z.string(),
    body: z.string().optional(),
    targetLabel: z.string().optional(),
    targetHref: z.string().optional(),
    preview: NotificationPreviewSchema.optional(),
    actions: z.array(NotificationActionSchema).default([]),
  })
  .openapi("NotificationFeedItem");

export type NotificationFeedItem = z.infer<typeof NotificationFeedItemSchema>;

export const NotificationInboxTabSchema = z.enum([
  "all",
  "following",
  "likes",
  "comments",
  "archived",
]);

export type NotificationInboxTab = z.infer<
  typeof NotificationInboxTabSchema
>;

export const NotificationInboxCategorySchema = z.enum([
  "following",
  "likes",
  "comments",
  "system",
  "jobs",
  "marketplace",
]);

export const NotificationInboxKindSchema = z.enum([
  "account_verified",
  "account_verification_failed",
  "policy_warning",
  "follow",
  "project_liked",
  "post_liked",
  "comment_liked",
  "project_commented",
  "reply",
  "mention",
  "project_featured",
  "project_tagged",
  "project_draft_reminder",
  "job_application_shortlisted",
  "job_application_rejected",
  "job_application_status",
  "product_approved",
  "marketplace_drop",
  "friend_product_added",
]);

export const NotificationInboxItemSchema = z
  .object({
    id: z.string(),
    kind: NotificationInboxKindSchema,
    tab: NotificationInboxCategorySchema,
    isRead: z.boolean(),
    isArchived: z.boolean(),
    createdAt: z.iso.datetime(),

    actorMode: z.enum(["user", "system", "group"]),
    actors: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        username: z.string().optional(),
        image: z.string().optional(),
        role: z.enum(["CREATIVE", "BRAND", "INVESTOR", "ADMIN"]).optional(),
      }),
    ),
    actorOverflowCount: z.int().nonnegative().optional(),

    icon: z
      .object({
        name: z.enum([
          "user",
          "heart",
          "bell",
          "briefcase",
          "badge-check",
          "alert",
          "megaphone",
        ]),
        intent: z
          .enum(["neutral", "success", "warning", "danger", "primary"])
          .optional(),
      })
      .optional(),

    message: z.object({
      parts: z
        .array(
          z.object({
            text: z.string(),
            tone: z.enum(["default", "muted", "primary"]).optional(),
            weight: z.enum(["regular", "medium", "semibold"]).optional(),
            href: z.string().optional(),
          }),
        )
        .min(1),
      subtitle: z.string().optional(),
      contextLabel: z.string().optional(),
      quote: z.string().optional(),
    }),

    target: z
      .object({
        href: z.string(),
        entityType: z.enum([
          "USER",
          "PROJECT",
          "POST",
          "COMMENT",
          "JOB",
          "JOB_APPLICATION",
          "PRODUCT",
          "CHAT",
          "SETTINGS",
        ]),
        entityId: z.string().optional(),
      })
      .optional(),

    preview: z
      .object({
        type: z.enum(["project", "product", "post", "comment", "job", "image"]),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        body: z.string().optional(),
        imageUrl: z.string().optional(),
        imageAlt: z.string().optional(),
        ownerName: z.string().optional(),
        ownerAvatarUrl: z.string().optional(),
        badge: z.enum(["featured", "locked", "new", "warning"]).optional(),
        href: z.string().optional(),
      })
      .optional(),

    actions: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          style: z.enum(["primary", "secondary", "link"]),
          href: z.string().optional(),
          mutation: z
            .object({
              method: z.enum(["POST", "PATCH"]),
              endpoint: z.string(),
              body: z.record(z.string(), z.unknown()).optional(),
            })
            .optional(),
        }),
      )
      .optional(),

    menuActions: z
      .array(
        z.enum([
          "mark_read",
          "mark_unread",
          "archive",
          "unarchive",
          "delete",
          "mute_type",
        ]),
      )
      .optional(),
  })
  .openapi("NotificationInboxItem");

export type NotificationInboxItem = z.infer<
  typeof NotificationInboxItemSchema
>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const ListNotificationsInputSchema = z.object({
  type: z.enum(NOTIFICATION_TYPES).optional(),
  tab: NotificationTabSchema.optional().default("all"),
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

export const ArchiveNotificationsInputSchema = z.object({
  notificationIds: z.array(z.cuid2()).min(1),
  archived: z.boolean().optional().default(true),
});

export type ArchiveNotificationsInput = z.infer<
  typeof ArchiveNotificationsInputSchema
>;

export const ListNotificationInboxInputSchema = z.object({
  tab: NotificationInboxTabSchema.optional().default("all"),
  unreadOnly: z.boolean().optional().default(false),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type ListNotificationInboxInput = z.infer<
  typeof ListNotificationInboxInputSchema
>;

export const BulkNotificationMutationInputSchema = z.object({
  notificationIds: z.array(z.string()).min(1),
});

export type BulkNotificationMutationInput = z.infer<
  typeof BulkNotificationMutationInputSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const ListNotificationsOutputSchema = z.object({
  notifications: z.array(NotificationDetailsEntitySchema),
  items: z.array(NotificationFeedItemSchema).default([]),
  nextCursor: z.string().optional(),
  unreadCount: z.int(),
});

export type ListNotificationsOutput = z.infer<
  typeof ListNotificationsOutputSchema
>;

export const NotificationMutationOutputSchema = z.object({
  success: z.boolean(),
  updatedCount: z.int().optional(),
  deletedCount: z.int().optional(),
});

export type NotificationMutationOutput = z.infer<
  typeof NotificationMutationOutputSchema
>;

export const ListNotificationInboxOutputSchema = z.object({
  notifications: z.array(NotificationInboxItemSchema),
  nextCursor: z.string().optional(),
  unreadCount: z.int(),
  tabCounts: z
    .object({
      all: z.int().optional(),
      following: z.int().optional(),
      likes: z.int().optional(),
      comments: z.int().optional(),
      archived: z.int().optional(),
    })
    .optional(),
});

export type ListNotificationInboxOutput = z.infer<
  typeof ListNotificationInboxOutputSchema
>;

export const NotificationCountOutputSchema = z.object({
  unreadCount: z.int(),
});

export type NotificationCountOutput = z.infer<
  typeof NotificationCountOutputSchema
>;
