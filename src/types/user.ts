import { z } from "@hono/zod-openapi";

import {
  UserEntitySchema,
  MinimalUserSchema,
  UserProfileEntitySchema,
  UserStatsEntitySchema,
  UserWithProjectsEntitySchema,
  UserWithPostsEntitySchema,
  UserWithProjectLikesEntitySchema,
  UserWithPostLikesEntitySchema,
  UserWithJobBookmarksEntitySchema,
  UserWithJobBookmarksInputSchema,
  UserWithJobBookmarksOutputSchema,
  UserWithProjectBookmarksEntitySchema,
  UserWithPostBookmarksEntitySchema,
  GetUserWithProjectBookmarksInputSchema,
  GetUserWithPostBookmarksInputSchema,
  GetUserWithProjectBookmarksOutputSchema,
  GetUserWithPostBookmarksOutputSchema,
  UserWithFollowingEntitySchema,
  UserWithFollowersEntitySchema,
  GetUserFollowingInputSchema,
  GetUserFollowersInputSchema,
  GetUserFollowingOutputSchema,
  GetUserFollowersOutputSchema,
  GetAuthenticatedUserOutputSchema,
  GetAuthenticatedUserProfileOutputSchema,
  GetAuthenticatedUserWithProjectsOutputSchema,
  GetAuthenticatedUserWithProjectBookmarksOutputSchema,
  GetAuthenticatedUserWithProjectLikesOutputSchema,
  GetAuthenticatedUserWithUserFollowingOutputSchema,
  GetAuthenticatedUserWithUserFollowersOutputSchema,
  GetUserActivityInputSchema,
  GetUserActivityOutputSchema,
  SearchUsersInputSchema,
  SearchUsersOutputSchema,
  UserSearchDocumentSchema,
} from "../schemas/user";

// ==========================================
// 1. CORE USER ENTITIES
// ==========================================
export type BaseUserEntity = z.infer<typeof UserEntitySchema>;
export type UserEntity = z.infer<typeof UserEntitySchema>;
export type MinimalUser = z.infer<typeof MinimalUserSchema>;
export type UserProfileEntity = z.infer<typeof UserProfileEntitySchema>;
export type UserStatsEntity = z.infer<typeof UserStatsEntitySchema>;

// ==========================================
// 2. CONTENT ASSOCIATIONS (Projects, Posts)
// ==========================================
export type UserWithProjectsEntity = z.infer<
  typeof UserWithProjectsEntitySchema
>;
export type UserWithUserPostsEntity = z.infer<typeof UserWithPostsEntitySchema>;

// ==========================================
// 3. LIKES
// ==========================================
export type UserWithProjectLikesEntity = z.infer<
  typeof UserWithProjectLikesEntitySchema
>;
export type UserWithPostLikesEntity = z.infer<
  typeof UserWithPostLikesEntitySchema
>;

// ==========================================
// 4. BOOKMARKS
// ==========================================
export type UserWithJobBookmarksEntity = z.infer<
  typeof UserWithJobBookmarksEntitySchema
>;
export type UserWithJobBookmarksInput = z.infer<
  typeof UserWithJobBookmarksInputSchema
>;
export type UserWithJobBookmarksOutput = z.infer<
  typeof UserWithJobBookmarksOutputSchema
>;

export type UserWithProjectBookmarksEntity = z.infer<
  typeof UserWithProjectBookmarksEntitySchema
>;
export type UserWithPostBookmarksEntity = z.infer<
  typeof UserWithPostBookmarksEntitySchema
>;

export type GetUserWithProjectBookmarksInput = z.infer<
  typeof GetUserWithProjectBookmarksInputSchema
>;
export type GetUserWithPostBookmarksInput = z.infer<
  typeof GetUserWithPostBookmarksInputSchema
>;
export type GetUserWithProjectBookmarksOutput = z.infer<
  typeof GetUserWithProjectBookmarksOutputSchema
>;
export type GetUserWithPostBookmarksOutput = z.infer<
  typeof GetUserWithPostBookmarksOutputSchema
>;

// ==========================================
// 5. FOLLOWERS & FOLLOWING
// ==========================================
export type UserWithFollowingEntity = z.infer<
  typeof UserWithFollowingEntitySchema
>;
export type UserWithFollowersEntity = z.infer<
  typeof UserWithFollowersEntitySchema
>;

export type GetUserFollowingInput = z.infer<typeof GetUserFollowingInputSchema>;
export type GetUserFollowersInput = z.infer<typeof GetUserFollowersInputSchema>;

export type GetUserFollowingOutput = z.infer<
  typeof GetUserFollowingOutputSchema
>;
export type GetUserFollowersOutput = z.infer<
  typeof GetUserFollowersOutputSchema
>;

// ==========================================
// 6. AUTHENTICATED USER OUTPUTS
// ==========================================
export type GetAuthenticatedUserOutput = z.infer<
  typeof GetAuthenticatedUserOutputSchema
>;
export type GetAuthenticatedUserProfileOutput = z.infer<
  typeof GetAuthenticatedUserProfileOutputSchema
>;
export type GetAuthenticatedUserWithProjectsOutput = z.infer<
  typeof GetAuthenticatedUserWithProjectsOutputSchema
>;
export type GetAuthenticatedUserWithProjectBookmarksOutput = z.infer<
  typeof GetAuthenticatedUserWithProjectBookmarksOutputSchema
>;
export type GetAuthenticatedUserWithProjectLikesOutput = z.infer<
  typeof GetAuthenticatedUserWithProjectLikesOutputSchema
>;
export type GetAuthenticatedUserWithUserFollowingOutput = z.infer<
  typeof GetAuthenticatedUserWithUserFollowingOutputSchema
>;
export type GetAuthenticatedUserWithUserFollowersOutput = z.infer<
  typeof GetAuthenticatedUserWithUserFollowersOutputSchema
>;

// ==========================================
// 7. ACTIVITY
// ==========================================
export type GetUserActivityInput = z.infer<typeof GetUserActivityInputSchema>;
export type GetUserActivityOutput = z.infer<typeof GetUserActivityOutputSchema>;

// ==========================================
// 8. SEARCH
// ==========================================
export type SearchUsersInput = z.infer<typeof SearchUsersInputSchema>;
export type SearchUsersOutput = z.infer<typeof SearchUsersOutputSchema>;
export type UserSearchDocument = z.infer<typeof UserSearchDocumentSchema>;
