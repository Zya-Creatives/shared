import { z } from "@hono/zod-openapi";

import {
  ROLES,
  USER_STATUSES,
  ONBOARDING_PAGES,
  ACTIVITY_TYPES,
  ACTIVITY_PARENT_TYPES,
} from "../constants";
import type {
  Role,
  UserStatus,
  OnboardingPage,
  ActivityType,
  ActivityParentType,
} from "../constants";
import { ProjectEntitySchema, ProjectSearchDocumentSchema } from "./project";
import { BookmarkEntitySchema } from "./bookmark";
import { LikeEntitySchema } from "./like";
import { BrandEntitySchema } from "./brand";
import { CreativeEntitySchema } from "./creative";
import { InvestorEntitySchema } from "./investor";
import {
  FeedPostEntitySchema,
  PostEntitySchema,
  PostWithFilesEntitySchema,
} from "./post";
import { JobEntitySchema, JobSearchDocumentSchema } from "./job";

// ==========================================
// 1. CORE USER ENTITIES
// ==========================================

export const UserEntitySchema = z
  .object({
    id: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
    email: z.email().openapi({ example: "user@example.com" }),
    emailVerified: z.boolean().openapi({ example: true }),
    name: z.string().optional().openapi({ example: "John Doe" }),
    image: z
      .string()
      .optional()
      .openapi({ example: "https://example.com/avatar.png" }),
    username: z.string().optional().openapi({ example: "johndoe" }),
    displayUsername: z.string().optional().openapi({ example: "@johndoe" }),
    role: z.enum(Object.values(ROLES) as [Role, ...Role[]]).openapi({
      example: "CREATIVE",
    }),
    status: z
      .enum(Object.values(USER_STATUSES) as [UserStatus, ...UserStatus[]])
      .openapi({
        example: "ACTIVE",
      }),
    onboardingPage: z
      .enum(
        Object.values(ONBOARDING_PAGES) as [
          OnboardingPage,
          ...OnboardingPage[],
        ],
      )
      .openapi({
        example: "DONE",
      }),
    createdAt: z.coerce.date().openapi({ example: "2026-03-11T09:00:00.000Z" }),
    version: z.int().openapi({ example: 1 }),
    updatedAt: z.coerce.date().openapi({ example: "2026-03-11T09:00:00.000Z" }),
  })
  .openapi("BaseUserEntity");

export const MinimalUserSchema = UserEntitySchema.pick({
  id: true,
  name: true,
  email: true,
  image: true,
  username: true,
  role: true,
}).openapi("MinimalUser");

export const UserProfileEntitySchema = UserEntitySchema.extend({
  profileType: z
    .enum(["creative", "brand", "investor"])
    .optional()
    .openapi({ example: "creative" }),
  brand: BrandEntitySchema,
  creative: CreativeEntitySchema,
  investor: InvestorEntitySchema,
}).openapi("UserProfileEntity");

export const UserStatsEntitySchema = z.object({
  followerCount: z.int().openapi({ example: 1540 }),
  followingCount: z.int().openapi({ example: 234 }),
  followingIds: z
    .array(z.cuid2())
    .openapi({ example: ["cksd0v6q0000s9a5y8z7p3x9", "clm1a2b3c0000abc"] }),
});

// ==========================================
// 2. CONTENT ASSOCIATIONS (Projects, Posts)
// ==========================================

export const UserWithProjectsEntitySchema = z
  .object({
    userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
    projects: z
      .array(ProjectEntitySchema.omit({ overview: true }))
      .openapi({ example: [] }),
  })
  .openapi("UserWithProjectsEntity");

export const UserWithPostsEntitySchema = z
  .object({
    userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
    posts: z.array(PostWithFilesEntitySchema).openapi({ example: [] }),
  })
  .openapi("UserWithPostsEntity");

// ==========================================
// 3. LIKES
// ==========================================

export const UserWithProjectLikesEntitySchema = z.object({
  userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
  projectLikes: z
    .array(
      LikeEntitySchema.extend({
        project: ProjectEntitySchema.pick({
          id: true,
          title: true,
          description: true,
          tags: true,
          startDate: true,
          endDate: true,
          imagePlaceholderUrl: true,
        }),
      }),
    )
    .openapi({ example: [] }),
});

export const UserWithPostLikesEntitySchema = z.object({
  userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
  postLikes: z
    .array(
      LikeEntitySchema.extend({
        post: PostEntitySchema.pick({
          id: true,
          parentId: true,
          title: true,
          content: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    )
    .openapi({ example: [] }),
});

// ==========================================
// 4. BOOKMARKS
// ==========================================

export const UserWithJobBookmarksEntitySchema = z.object({
  userId: z.cuid2().openapi({ example: "afoaifaofi" }),
  jobBookmarks: z
    .array(
      BookmarkEntitySchema.extend({
        job: JobSearchDocumentSchema.extend({
          isBookmarked: z.boolean().default(true),
        }),
      }),
    )
    .optional(),
});

export const UserWithJobBookmarksInputSchema = z.object({
  cursor: z.string().optional().nullable(),
  limit: z.int().positive().optional().nullable(),
});

export const UserWithJobBookmarksOutputSchema = z.object({
  bookmarks: UserWithJobBookmarksEntitySchema,
  nextCursor: z.string().nullable(),
});

export const UserWithProjectBookmarksEntitySchema = z
  .object({
    userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
    projectBookmarks: z
      .array(
        BookmarkEntitySchema.extend({
          project: ProjectSearchDocumentSchema,
        }),
      )
      .openapi({ example: [] }),
  })
  .openapi("UserWithProjectBookmarksEntity");

export const UserWithPostBookmarksEntitySchema = z.object({
  userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
  postBookmarks: z.array(
    BookmarkEntitySchema.extend({
      post: PostWithFilesEntitySchema,
    }),
  ),
});

export const GetUserWithProjectBookmarksInputSchema =
  UserWithJobBookmarksInputSchema;
export const GetUserWithPostBookmarksInputSchema =
  UserWithJobBookmarksInputSchema;

export const GetUserWithProjectBookmarksOutputSchema = z.object({
  bookmarks: UserWithProjectBookmarksEntitySchema,
  nextCursor: z.string().nullable(),
});

export const GetUserWithPostBookmarksOutputSchema = z.object({
  bookmarks: UserWithPostBookmarksEntitySchema,
  nextCursor: z.string().nullable(),
});

// ==========================================
// 5. FOLLOWERS & FOLLOWING
// ==========================================

export const UserWithFollowingEntitySchema = MinimalUserSchema.extend({
  following: z
    .array(
      MinimalUserSchema.extend({
        isFollowing: z.boolean().optional().openapi({ example: true }),
        followsYou: z.boolean().optional().openapi({ example: false }),
      }),
    )
    .openapi({
      description: "List of users this user is following.",
      example: [],
    }),
}).openapi("UserWithFollowingEntity");

export const UserWithFollowersEntitySchema = MinimalUserSchema.extend({
  followers: z
    .array(
      MinimalUserSchema.extend({
        isFollowing: z.boolean().optional().openapi({ example: false }),
        followsYou: z.boolean().optional().openapi({ example: true }),
      }),
    )
    .openapi({
      description: "List of users who follow this user.",
      example: [],
    }),
}).openapi("UserWithFollowersEntity");

export const GetUserFollowingInputSchema = z.object({
  searchQuery: z.string().optional().openapi({ example: "design systems" }),
  offset: z.number().int().nonnegative().optional().openapi({ example: 20 }),
});

export const GetUserFollowersInputSchema = z.object({
  searchQuery: z.string().optional().openapi({ example: "design systems" }),
  offset: z.number().int().nonnegative().optional().openapi({ example: 20 }),
});

export const GetUserFollowingOutputSchema = z.object({
  nextCursor: z.string().openapi({ example: "cksd0v6q0000nxtcur" }),
  following: z
    .array(
      MinimalUserSchema.extend({
        isFollowing: z.boolean().optional().openapi({ example: true }),
        followsYou: z.boolean().optional().openapi({ example: false }),
      }),
    )
    .openapi({ example: [] }),
});

export const GetUserFollowersOutputSchema = z.object({
  nextCursor: z.string().openapi({ example: "cksd0v6q0000nxtcur" }),
  followers: z
    .array(
      MinimalUserSchema.extend({
        isFollowing: z.boolean().optional().openapi({ example: false }),
        followsYou: z.boolean().optional().openapi({ example: true }),
      }),
    )
    .openapi({ example: [] }),
});

// ==========================================
// 6. AUTHENTICATED USER OUTPUTS
// ==========================================

export const GetAuthenticatedUserOutputSchema = UserEntitySchema;
export const GetAuthenticatedUserProfileOutputSchema = UserProfileEntitySchema;
export const GetAuthenticatedUserWithProjectsOutputSchema =
  UserWithProjectsEntitySchema;
export const GetAuthenticatedUserWithProjectBookmarksOutputSchema =
  UserWithProjectBookmarksEntitySchema;
export const GetAuthenticatedUserWithProjectLikesOutputSchema =
  UserWithProjectLikesEntitySchema;
export const GetAuthenticatedUserWithUserFollowingOutputSchema =
  UserWithFollowingEntitySchema;
export const GetAuthenticatedUserWithUserFollowersOutputSchema =
  UserWithFollowersEntitySchema;

// ==========================================
// 7. ACTIVITY
// ==========================================

export const GetUserActivityInputSchema = z.object({
  activityType: z
    .enum(Object.values(ACTIVITY_TYPES) as [ActivityType, ...ActivityType[]])
    .openapi({ example: "LIKE" }),
});

export const GetUserActivityOutputSchema = z
  .array(
    z.object({
      parentId: z.cuid2().openapi({ example: "ckj1a2b3c0000prt" }),
      parentType: z
        .enum(
          Object.values(ACTIVITY_PARENT_TYPES) as [
            ActivityParentType,
            ...ActivityParentType[],
          ],
        )
        .openapi({ example: "POST" }),
    }),
  )
  .openapi({ example: [] });

// ==========================================
// 8. SEARCH
// ==========================================

export const SearchUsersInputSchema = z.object({
  query: z.string().default("").openapi({
    example: "john",
    description: "Search by name, email, username, or discipline",
  }),
  role: z
    .enum(Object.values(ROLES) as [Role, ...Role[]])
    .optional()
    .openapi({ example: "CREATIVE" }),
  limit: z.coerce.number().min(1).max(100).default(20).openapi({ example: 20 }),
  cursor: z.string().optional().openapi({
    example: "cksd0v6q0000cursor",
    description: "The offset/cursor for pagination",
  }),
});

export const SearchUsersOutputSchema = z.object({
  users: z
    .array(
      MinimalUserSchema.extend({
        isFollowing: z.boolean().optional().openapi({ example: false }),
        followsYou: z.boolean().optional().openapi({ example: true }),
        noOfFollowers: z
          .number()
          .int()
          .nonnegative()
          .optional()
          .openapi({ example: 1200 }),
        disciplines: z
          .array(z.string())
          .optional()
          .openapi({ example: ["UI/UX", "Frontend"] }),
      }),
    )
    .openapi({ example: [] }),
  nextCursor: z.string().optional().openapi({
    example: "abc123nxt",
    description: "The next cursor for pagination",
  }),
});

export const UserSearchDocumentSchema = z
  .object({
    id: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
    email: z.email().openapi({ example: "user@example.com" }),
    username: z.string().nullable().openapi({ example: "johndoe" }),
    name: z.string().nullable().openapi({ example: "John Doe" }),
    image: z
      .string()
      .nullable()
      .openapi({ example: "https://example.com/avatar.png" }),
    role: z
      .enum(Object.values(ROLES) as [Role, ...Role[]])
      .openapi({ example: "CREATIVE" }),
    bio: z.string().nullable().openapi({
      example: "Passionate designer and developer based in Lagos.",
    }),
    location: z.string().nullable().openapi({ example: "Lagos, Nigeria" }),
    disciplines: z
      .array(z.string())
      .nullable()
      .openapi({ example: ["Design Systems", "Web Development"] }),
    updatedAt: z
      .string()
      .nullable()
      .openapi({ example: "2026-03-11T09:00:00.000Z" }),
    createdAt: z
      .string()
      .nullable()
      .openapi({ example: "2026-03-11T09:00:00.000Z" }),
  })
  .openapi({
    title: "User Search Document",
    description: "Flattened schema used for indexing users in search engines.",
  });
