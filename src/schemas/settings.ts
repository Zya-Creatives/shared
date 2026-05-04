import { z } from "zod";

/**
 * --------------------------------
 * PROFILE VISIBILITY
 * --------------------------------
 */

export const ProfileVisibilitySettingsSchema = z
  .object({
    privateAccount: z.boolean().default(false),
    showAboutMe: z.boolean().default(true),
    showLocation: z.boolean().default(true),
    showVerificationBadge: z.boolean().default(true),
    allowDirectMessaging: z.boolean().default(true),
    whoCanSendChatRequests: z
      .enum(["everyone", "followers", "nobody"])
      .default("everyone"),
    showPostsOnProfile: z.boolean().default(true),
    showProjectsOnProfile: z.boolean().default(true),
    enableCommentsOnPosts: z.boolean().default(true),
    enableCommentsOnProjects: z.boolean().default(true),
    whoCanMentionYou: z
      .enum(["everyone", "followers", "nobody"])
      .default("everyone"),
  })
  .nullable();

export type ProfileVisibilitySettings = z.infer<
  typeof ProfileVisibilitySettingsSchema
>;

/**
 * --------------------------------
 * EXPLORE & FEED
 * --------------------------------
 */

export const ExploreAndFeedSettingsSchema = z
  .object({
    feedAlgorithm: z
      .enum(["latest", "recommended", "following"])
      .default("recommended"),
    filterSensitiveContent: z.boolean().default(false),
    enableFeedRecommendations: z.boolean().default(true),
  })
  .nullable();

export type ExploreAndFeedSettings = z.infer<
  typeof ExploreAndFeedSettingsSchema
>;

/**
 * --------------------------------
 * NOTIFICATIONS
 * --------------------------------
 */

export const NotificationsSettingsSchema = z
  .object({
    enableNotifications: z.boolean().default(true),
    emailNotifications: z.boolean().default(true),
    allowMentionNotif: z.boolean().default(true),
    allowPostCommentNotif: z.boolean().default(true),
    allowProjectCommentNotif: z.boolean().default(true),
    allowLikeNotif: z.boolean().default(true),
    allowFollowNotif: z.boolean().default(true),
    allowOpportunityUpdateNotif: z.boolean().default(true),
    allowInvestmentSignalNotif: z.boolean().default(true),
    allowDirectMessageNotif: z.boolean().default(true),
    zyaUpdatesNotif: z.boolean().default(true),
    platformAnnouncementsNotif: z.boolean().default(true),
    zyaDigestNotif: z.boolean().default(true),
  })
  .nullable();

export type NotificationsSettings = z.infer<typeof NotificationsSettingsSchema>;

/**
 * --------------------------------
 * ENTITY
 * --------------------------------
 */

export const UserSettingsSchema = z.object({
  id: z.cuid2(),
  userId: z.cuid2(),
  profileVisibilitySettings: ProfileVisibilitySettingsSchema,
  exploreAndFeedSettings: ExploreAndFeedSettingsSchema,
  notificationSettings: NotificationsSettingsSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateUserSettingsInputSchema = z.object({
  userId: z.cuid2(),

  profileVisibilitySettings: ProfileVisibilitySettingsSchema.optional(),

  exploreAndFeedSettings: ExploreAndFeedSettingsSchema.optional(),

  notificationSettings: NotificationsSettingsSchema.optional(),
});

export type CreateUserSettingsInput = z.infer<
  typeof CreateUserSettingsInputSchema
>;

/**
 * Optional but useful (you’ll likely need this soon)
 */
export const UpdateUserSettingsInputSchema =
  CreateUserSettingsInputSchema.partial();

export type UpdateUserSettingsInput = z.infer<
  typeof UpdateUserSettingsInputSchema
>;
