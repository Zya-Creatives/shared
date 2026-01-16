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
import { ProjectEntitySchema } from "./project";
import { BookmarkEntitySchema } from "./bookmark";
import { LikeEntitySchema } from "./like";
import { BrandEntitySchema } from "./brand";
import { CreativeEntitySchema } from "./creative";
import { InvestorEntitySchema } from "./investor";
import { PostWithFilesEntitySchema } from "./post";

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
        createdAt: z.coerce
            .date()
            .openapi({ example: "2025-10-13T09:00:00.000Z" }),
        updatedAt: z.coerce
            .date()
            .openapi({ example: "2025-10-13T09:00:00.000Z" }),
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

export const UserStatsEntitySchema = z.object({
    followerCount: z.int(),
    followingCount: z.int(),
    followingIds: z.array(z.string()),
});

export const UserProfileEntitySchema = UserEntitySchema.extend({
    profileType: z.enum(["creative", "brand", "investor"]).optional(),
    brand: BrandEntitySchema,
    creative: CreativeEntitySchema,
    investor: InvestorEntitySchema,
}).openapi("UserProfileEntity");

export const UserWithProjectsEntitySchema = z
    .object({
        userId: z.cuid2(),
        projects: z.array(ProjectEntitySchema.omit({ overview: true })),
    })
    .openapi("UserWithProjectsEntity");

export const UserWithProjectLikesEntitySchema = z.object({
    userId: z.cuid2(),
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

export const UserWithProjectBookmarksEntitySchema = z
    .object({
        userId: z.cuid2(),
        projectBookmarks: z.array(
            BookmarkEntitySchema.extend({
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
    })
    .openapi("UserWithProjectBookmarksEntity");

export const GetUserFollowingInputSchema = z.object({
    searchQuery: z.string().optional().openapi({ example: "design systems" }),
    offset: z.number().int().nonnegative().optional().openapi({ example: 20 }),
});

export const GetUserFollowersInputSchema = z.object({
    searchQuery: z.string().optional().openapi({ example: "design systems" }),
    offset: z.number().int().nonnegative().optional().openapi({ example: 20 }),
});
export const UserWithFollowingEntitySchema = MinimalUserSchema.extend({
    following: z
        .array(
            MinimalUserSchema.extend({
                isFollowing: z.boolean().optional(),
                followsYou: z.boolean().optional(),
            }),
        )
        .openapi({ description: "List of users this user is following." }),
}).openapi("UserWithFollowingEntity");

export const UserWithFollowersEntitySchema = MinimalUserSchema.extend({
    followers: z
        .array(
            MinimalUserSchema.extend({
                isFollowing: z.boolean().optional(),
                followsYou: z.boolean().optional(),
            }),
        )
        .openapi({ description: "List of users who follow this user." }),
}).openapi("UserWithFollowersEntity");

export const GetUserFollowersOutputSchema = z.object({
    nextCursor: z.string(),
    followers: z.array(
        MinimalUserSchema.extend({
            isFollowing: z.boolean().optional(),
            followsYou: z.boolean().optional(),
        }),
    ),
});

export const GetUserFollowingOutputSchema = z.object({
    nextCursor: z.string(),
    following: z.array(
        MinimalUserSchema.extend({
            isFollowing: z.boolean().optional(),
            followsYou: z.boolean().optional(),
        }),
    ),
});

export const UserWithPostsEntitySchema = z
    .object({
        userId: z.cuid2(),
        posts: z.array(PostWithFilesEntitySchema),
    })
    .openapi("UserWithPostsEntity");

export const GetAuthenticatedUserOutputSchema = UserEntitySchema;

export const GetAuthenticatedUserProfileOutputSchema = UserProfileEntitySchema;

export const GetAuthenticatedUserWithProjectsOutputSchema =
    UserWithProjectsEntitySchema;

export const GetAuthenticatedUserWithProjectBookmarksOutputSchema =
    UserWithProjectBookmarksEntitySchema;

export const GetAuthenticatedUserWithUserFollowingOutputSchema =
    UserWithFollowingEntitySchema;

export const GetAuthenticatedUserWithUserFollowersOutputSchema =
    UserWithFollowersEntitySchema;

export const GetAuthenticatedUserWithProjectLikesOutputSchema =
    UserWithProjectLikesEntitySchema;

export const GetUserActivityInputSchema = z.object({
    activityType: z.enum(
        Object.values(ACTIVITY_TYPES) as [ActivityType, ...ActivityType[]],
    ),
});

export const GetUserActivityOutputSchema = z.array(
    z.object({
        parentId: z.string(),
        parentType: z.enum(
            Object.values(ACTIVITY_PARENT_TYPES) as [
                ActivityParentType,
                ...ActivityParentType[],
            ],
        ),
    }),
);
