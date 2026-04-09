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
import { ProductEntitySchema } from "./product";

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

export type BaseUserEntity = z.infer<typeof UserEntitySchema>;
export type UserEntity = z.infer<typeof UserEntitySchema>;

export const MinimalUserSchema = UserEntitySchema.pick({
  id: true,
  name: true,
  email: true,
  image: true,
  username: true,
  role: true,
}).openapi("MinimalUser");

export type MinimalUser = z.infer<typeof MinimalUserSchema>;

export const UserProfileEntitySchema = UserEntitySchema.extend({
  profileType: z
    .enum(["creative", "brand", "investor"])
    .optional()
    .openapi({ example: "creative" }),
  brand: BrandEntitySchema,
  creative: CreativeEntitySchema,
  investor: InvestorEntitySchema,
}).openapi("UserProfileEntity");

export type UserProfileEntity = z.infer<typeof UserProfileEntitySchema>;

export const UserStatsEntitySchema = z.object({
  followerCount: z.int().openapi({ example: 1540 }),
  followingCount: z.int().openapi({ example: 234 }),
  followingIds: z
    .array(z.cuid2())
    .openapi({ example: ["cksd0v6q0000s9a5y8z7p3x9", "clm1a2b3c0000abc"] }),
});

export type UserStatsEntity = z.infer<typeof UserStatsEntitySchema>;

export const UserWithProjectsEntitySchema = z
  .object({
    userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
    projects: z
      .array(ProjectEntitySchema.omit({ overview: true }))
      .openapi({ example: [] }),
  })
  .openapi("UserWithProjectsEntity");

export type UserWithProjectsEntity = z.infer<
  typeof UserWithProjectsEntitySchema
>;

export const UserWithPostsEntitySchema = z
  .object({
    userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
    posts: z.array(PostWithFilesEntitySchema).openapi({ example: [] }),
  })
  .openapi("UserWithPostsEntity");

export type UserWithUserPostsEntity = z.infer<typeof UserWithPostsEntitySchema>;

export const UserAuthStatusEntitySchema = z.object({
  exists: z.boolean(),
  isOAuthOnly: z.boolean(),
  providers: z.array(z.string()),
});

export type UserAuthStatusEntity = z.infer<typeof UserAuthStatusEntitySchema>;

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

export type UserWithProjectLikesEntity = z.infer<
  typeof UserWithProjectLikesEntitySchema
>;

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

export type UserWithPostLikesEntity = z.infer<
  typeof UserWithPostLikesEntitySchema
>;

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

export type UserWithJobBookmarksEntity = z.infer<
  typeof UserWithJobBookmarksEntitySchema
>;

export const UserWithJobBookmarksInputSchema = z.object({
  cursor: z.string().optional().nullable(),
  limit: z.int().positive().optional().nullable(),
});

export type UserWithJobBookmarksInput = z.infer<
  typeof UserWithJobBookmarksInputSchema
>;

export const UserWithJobBookmarksOutputSchema = z.object({
  bookmarks: UserWithJobBookmarksEntitySchema,
  nextCursor: z.string().nullable(),
});

export type UserWithJobBookmarksOutput = z.infer<
  typeof UserWithJobBookmarksOutputSchema
>;

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

export type UserWithProjectBookmarksEntity = z.infer<
  typeof UserWithProjectBookmarksEntitySchema
>;

export const UserWithPostBookmarksEntitySchema = z.object({
  userId: z.cuid2().openapi({ example: "cksd0v6q0000s9a5y8z7p3x9" }),
  postBookmarks: z.array(
    BookmarkEntitySchema.extend({
      post: PostWithFilesEntitySchema,
    }),
  ),
});

export type UserWithPostBookmarksEntity = z.infer<
  typeof UserWithPostBookmarksEntitySchema
>;

export const UserWithProductsEntitySchema = z.object({
  userId: z.cuid2(),
  products: z.array(ProductEntitySchema),
});

export type UserWithProductsEntity = z.infer<
  typeof UserWithProductsEntitySchema
>;

export const GetUserWithProjectBookmarksInputSchema =
  UserWithJobBookmarksInputSchema;

export type GetUserWithProjectBookmarksInput = z.infer<
  typeof GetUserWithProjectBookmarksInputSchema
>;

export const GetUserWithPostBookmarksInputSchema =
  UserWithJobBookmarksInputSchema;

export type GetUserWithPostBookmarksInput = z.infer<
  typeof GetUserWithPostBookmarksInputSchema
>;

export const GetUserWithProjectBookmarksOutputSchema = z.object({
  bookmarks: UserWithProjectBookmarksEntitySchema,
  nextCursor: z.string().nullable(),
});

export type GetUserWithProjectBookmarksOutput = z.infer<
  typeof GetUserWithProjectBookmarksOutputSchema
>;

export const GetUserWithProductsOutputSchema = z.object({
  products: UserWithProductsEntitySchema,
  noOfProducts: z.int().nullable(),
  nextCursor: z.string().nullable(),
});

export type UserWithProductsOutput = z.infer<
  typeof GetUserWithProductsOutputSchema
>;

export const GetUserWithPostBookmarksOutputSchema = z.object({
  bookmarks: z.array(
    BookmarkEntitySchema.extend({
      post: FeedPostEntitySchema,
    }),
  ),
  nextCursor: z.string().nullable(),
});

export type GetUserWithPostBookmarksOutput = z.infer<
  typeof GetUserWithPostBookmarksOutputSchema
>;

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

export type UserWithFollowingEntity = z.infer<
  typeof UserWithFollowingEntitySchema
>;

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

export type UserWithFollowersEntity = z.infer<
  typeof UserWithFollowersEntitySchema
>;

export const GetUserFollowingInputSchema = z.object({
  searchQuery: z.string().optional().openapi({ example: "design systems" }),
  offset: z.number().int().nonnegative().optional().openapi({ example: 20 }),
});

export type GetUserFollowingInput = z.infer<typeof GetUserFollowingInputSchema>;

export const GetUserFollowersInputSchema = z.object({
  searchQuery: z.string().optional().openapi({ example: "design systems" }),
  offset: z.number().int().nonnegative().optional().openapi({ example: 20 }),
});

export type GetUserFollowersInput = z.infer<typeof GetUserFollowersInputSchema>;

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

export type GetUserFollowingOutput = z.infer<
  typeof GetUserFollowingOutputSchema
>;

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

export type GetUserFollowersOutput = z.infer<
  typeof GetUserFollowersOutputSchema
>;

export const GetAuthenticatedUserOutputSchema = UserEntitySchema;

export type GetAuthenticatedUserOutput = z.infer<
  typeof GetAuthenticatedUserOutputSchema
>;

export const GetAuthenticatedUserProfileOutputSchema = UserProfileEntitySchema;

export type GetAuthenticatedUserProfileOutput = z.infer<
  typeof GetAuthenticatedUserProfileOutputSchema
>;

export const GetAuthenticatedUserWithProjectsOutputSchema =
  UserWithProjectsEntitySchema;

export type GetAuthenticatedUserWithProjectsOutput = z.infer<
  typeof GetAuthenticatedUserWithProjectsOutputSchema
>;

export const GetAuthenticatedUserWithProjectBookmarksOutputSchema =
  UserWithProjectBookmarksEntitySchema;

export type GetAuthenticatedUserWithProjectBookmarksOutput = z.infer<
  typeof GetAuthenticatedUserWithProjectBookmarksOutputSchema
>;

export const GetAuthenticatedUserWithProjectLikesOutputSchema =
  UserWithProjectLikesEntitySchema;

export type GetAuthenticatedUserWithProjectLikesOutput = z.infer<
  typeof GetAuthenticatedUserWithProjectLikesOutputSchema
>;

export const GetAuthenticatedUserWithUserFollowingOutputSchema =
  UserWithFollowingEntitySchema;

export type GetAuthenticatedUserWithUserFollowingOutput = z.infer<
  typeof GetAuthenticatedUserWithUserFollowingOutputSchema
>;

export const GetAuthenticatedUserWithUserFollowersOutputSchema =
  UserWithFollowersEntitySchema;

export type GetAuthenticatedUserWithUserFollowersOutput = z.infer<
  typeof GetAuthenticatedUserWithUserFollowersOutputSchema
>;

export const GetUserActivityInputSchema = z.object({
  activityType: z
    .enum(Object.values(ACTIVITY_TYPES) as [ActivityType, ...ActivityType[]])
    .openapi({ example: "LIKE" }),
});

export type GetUserActivityInput = z.infer<typeof GetUserActivityInputSchema>;

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

export type GetUserActivityOutput = z.infer<typeof GetUserActivityOutputSchema>;

const coerceArray = (val: unknown) => {
  if (typeof val === "string") return val === "" ? [] : val.split(",");
  return val;
};

export const SearchUsersInputSchema = z.object({
  query: z.string().default("").openapi({
    example: "john",
    description: "Search by name, email, username, or discipline",
  }),
  roles: z
    .preprocess(
      coerceArray,
      z.array(z.enum(Object.values(ROLES) as [Role, ...Role[]])),
    )
    .optional()
    .openapi({ example: ["CREATIVE", "BRAND"] }),
  disciplines: z
    .preprocess(coerceArray, z.array(z.string()))
    .optional()
    .openapi({ example: ["Design Systems", "Web Development"] }),
  locations: z
    .preprocess(coerceArray, z.array(z.string()))
    .optional()
    .openapi({ example: ["Lagos, Nigeria", "London, UK"] }),
  limit: z.coerce.number().min(1).max(100).default(20).openapi({ example: 20 }),
  cursor: z.string().nullable().optional().openapi({
    example: "cksd0v6q0000cursor",
    description: "The offset/cursor for pagination",
  }),
});

export type SearchUsersInput = z.infer<typeof SearchUsersInputSchema>;

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

export type SearchUsersOutput = z.infer<typeof SearchUsersOutputSchema>;

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

export type UserSearchDocument = z.infer<typeof UserSearchDocumentSchema>;
