import { z } from "zod";


export const ProfileVisibilitySettingsSchema = z.object({
  privateAccount: z.boolean(),
  showAboutMe: z.boolean(),
  showLocation: z.boolean(),
  showVerificationBadge: z.boolean(),
  allowDirectMessaging: z.boolean(),
  whoCanSendChatRequests: z.enum(["everyone", "followers", "nobody"]),
  showPostsOnProfile: z.boolean(),
  showProjectsOnProfile: z.boolean(),
  enableCommentsOnPosts: z.boolean(),
  enableCommentsOnProjects: z.boolean(),
  whoCanMentionYou: z.enum(["everyone", "followers", "nobody"]),
});

export type ProfileVisibilitySettings = z.infer<typeof ProfileVisibilitySettingsSchema>;


export const ExploreAndFeedSettingsSchema = z.object({
  feedAlgorithm: z.enum(["latest", "recommended", "following"]),
  filterSensitiveContent: z.boolean(),
  enableFeedRecommendations: z.boolean(),
});

export type ExploreAndFeedSettings = z.infer<typeof ExploreAndFeedSettingsSchema>;


export const NotificationsSettingsSchema = z.object({
  enableNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  allowMentionNotif: z.boolean(),
  allowPostCommentNotif: z.boolean(),
  allowProjectCommentNotif: z.boolean(),
  allowLikeNotif: z.boolean(),
  allowFollowNotif: z.boolean(),
  allowOpportunityUpdateNotif: z.boolean(),
  allowInvestmentSignalNotif: z.boolean(),
  allowDirectMessageNotif: z.boolean(),
  zyaUpdatesNotif: z.boolean(),
  platformAnnouncementsNotif: z.boolean(),
  zyaDigestNotif: z.boolean(),
});

export type Notifications = z.infer<typeof NotificationsSettingsSchema>;


export const UserSettingsSchema = z.object({
  profileVisibility: ProfileVisibilitySettingsSchema,
  exploreAndFeed: ExploreAndFeedSettingsSchema,
  notifications: NotificationsSettingsSchema,
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
