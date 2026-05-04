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
import { PostEntitySchema, PostWithFilesEntitySchema } from "./post";
import { JobSearchDocumentSchema } from "./job";
import { ProductEntitySchema } from "./product";
import { MinimalUserSchema } from "./minimal-user";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const UserShape = z.object({
  email: z.email(),
  emailVerified: z.boolean(),
  name: z.string().default(""),
  image: z.string().default(""),
  username: z.string().default(""),
  displayUsername: z.string().default(""),
  role: z.enum(Object.values(ROLES) as [Role, ...Role[]]),
  status: z.enum(Object.values(USER_STATUSES) as [UserStatus, ...UserStatus[]]),
  onboardingPage: z.enum(
    Object.values(ONBOARDING_PAGES) as [OnboardingPage, ...OnboardingPage[]],
  ),
});

export type UserShapeType = z.infer<typeof UserShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const UserEntitySchema = z
  .object({
    id: z.cuid2(),
    ...UserShape.shape,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    version: z.int(),
  })
  .openapi("User");

export type UserEntity = z.infer<typeof UserEntitySchema>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */


export const UserProfileEntitySchema = UserEntitySchema.extend({
  profileType: z.enum(["creative", "brand", "investor"]).optional(),
  brand: BrandEntitySchema.optional(),
  creative: CreativeEntitySchema.optional(),
  investor: InvestorEntitySchema.optional(),
}).openapi("UserProfile");

export type UserProfileEntity = z.infer<typeof UserProfileEntitySchema>;

export const UserStatsEntitySchema = z.object({
  followerCount: z.int(),
  followingCount: z.int(),
  followingIds: z.array(z.cuid2()),
});

export type UserStatsEntity = z.infer<typeof UserStatsEntitySchema>;

/**
 * --------------------------------
 * COMPOSED ENTITIES
 * --------------------------------
 */

const UserWithId = z.object({ userId: z.cuid2() });
export type UserWithIdType = z.infer<typeof UserWithId>;

export const UserWithProjectsEntitySchema = UserWithId.extend({
  projects: z.array(ProjectEntitySchema.omit({ overview: true })),
});
export type UserWithProjectsEntity = z.infer<
  typeof UserWithProjectsEntitySchema
>;

export const UserWithPostsEntitySchema = UserWithId.extend({
  posts: z.array(PostWithFilesEntitySchema),
});
export type UserWithPostsEntity = z.infer<typeof UserWithPostsEntitySchema>;

export const UserWithProjectLikesEntitySchema = UserWithId.extend({
  projectLikes: z.array(
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
  ),
});
export type UserWithProjectLikesEntity = z.infer<
  typeof UserWithProjectLikesEntitySchema
>;

export const UserWithPostLikesEntitySchema = UserWithId.extend({
  postLikes: z.array(
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
  ),
});
export type UserWithPostLikesEntity = z.infer<
  typeof UserWithPostLikesEntitySchema
>;

/**
 * --------------------------------
 * BOOKMARKS
 * --------------------------------
 */

export const UserWithJobBookmarksEntitySchema = UserWithId.extend({
  jobBookmarks: z.array(
    BookmarkEntitySchema.extend({
      job: JobSearchDocumentSchema.extend({
        isBookmarked: z.boolean().default(true),
      }),
    }),
  ),
});
export type UserWithJobBookmarksEntity = z.infer<
  typeof UserWithJobBookmarksEntitySchema
>;

export const UserWithProjectBookmarksEntitySchema = UserWithId.extend({
  projectBookmarks: z.array(
    BookmarkEntitySchema.extend({
      project: ProjectSearchDocumentSchema,
    }),
  ),
});
export type UserWithProjectBookmarksEntity = z.infer<
  typeof UserWithProjectBookmarksEntitySchema
>;

export const UserWithPostBookmarksEntitySchema = UserWithId.extend({
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

export const UserAuthStatusEntitySchema = z.object({
  exists: z.boolean(),
  isOAuthOnly: z.boolean(),
  providers: z.array(z.string()),
});

export const UserWithJobBookmarksInputSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type UserAuthStatusEntity = z.infer<typeof UserAuthStatusEntitySchema>;
export type UserWithJobBookmarksInput = z.infer<
  typeof UserWithJobBookmarksEntitySchema
>;

/**
 * --------------------------------
 * FOLLOW SYSTEM
 * --------------------------------
 */

const FollowMeta = z.object({
  isFollowing: z.boolean(),
  followsYou: z.boolean(),
});
export type FollowMeta = z.infer<typeof FollowMeta>;

export const UserWithFollowingEntitySchema = MinimalUserSchema.extend({
  following: z.array(MinimalUserSchema.extend(FollowMeta.shape)),
});
export type UserWithFollowingEntity = z.infer<
  typeof UserWithFollowingEntitySchema
>;

export const UserWithFollowersEntitySchema = MinimalUserSchema.extend({
  followers: z.array(MinimalUserSchema.extend(FollowMeta.shape)),
});
export type UserWithFollowersEntity = z.infer<
  typeof UserWithFollowersEntitySchema
>;

/**
 * --------------------------------
 * SEARCH USERS
 * --------------------------------
 */

const CursorPaginationInput = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type CursorPaginationInput = z.infer<typeof CursorPaginationInput>;

const coerceArray = (val: unknown) => {
  if (typeof val === "string") return val === "" ? [] : val.split(",");
  return val;
};

export const SearchUsersInputSchema = z.object({
  query: z.string().default(""),
  roles: z
    .preprocess(
      coerceArray,
      z.array(z.enum(Object.values(ROLES) as [Role, ...Role[]])),
    )
    .optional(),
  disciplines: z.preprocess(coerceArray, z.array(z.string())).optional(),
  locations: z.preprocess(coerceArray, z.array(z.string())).optional(),
  ...CursorPaginationInput.shape,
});
export type SearchUsersInput = z.infer<typeof SearchUsersInputSchema>;

export const SearchUsersOutputSchema = z.object({
  users: z.array(
    MinimalUserSchema.extend({
      isFollowing: z.boolean(),
      followsYou: z.boolean(),
      noOfFollowers: z.number().int(),
      disciplines: z.array(z.string()),
    }),
  ),
  nextCursor: z.string().optional(),
});
export type SearchUsersOutput = z.infer<typeof SearchUsersOutputSchema>;

/**
 * --------------------------------
 * ACTIVITY
 * --------------------------------
 */

export const GetUserActivityInputSchema = z.object({
  activityType: z.enum(
    Object.values(ACTIVITY_TYPES) as [ActivityType, ...ActivityType[]],
  ),
});
export type GetUserActivityInput = z.infer<typeof GetUserActivityInputSchema>;

export const GetUserActivityOutputSchema = z.array(
  z.object({
    parentId: z.cuid2(),
    parentType: z.enum(
      Object.values(ACTIVITY_PARENT_TYPES) as [
        ActivityParentType,
        ...ActivityParentType[],
      ],
    ),
  }),
);
export type GetUserActivityOutput = z.infer<typeof GetUserActivityOutputSchema>;

/**
 * --------------------------------
 * SEARCH DOCUMENT
 * --------------------------------
 */

export const UserSearchDocumentSchema = z.object({
  id: z.cuid2(),
  email: z.email(),
  username: z.string().nullable(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  role: z.enum(Object.values(ROLES) as [Role, ...Role[]]),
  location: z.string().nullable(),
  disciplines: z.array(z.string()).nullable(),
  updatedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime().nullable(),
});
export type UserSearchDocument = z.infer<typeof UserSearchDocumentSchema>;
