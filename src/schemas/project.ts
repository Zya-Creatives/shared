import { z } from "@hono/zod-openapi";
import {
  CLIENT_TYPES,
  PROJECT_STATUS,
  ROLES,
  VENTURE_STAGES,
  WAGES_CURRENCY,
} from "../constants";
import { CommentEntitySchema } from "./comment";
import { BookmarkEntitySchema } from "./bookmark";
import { ViewEntitySchema } from "./view";
import { MinimalUserSchema } from "./user";
import { ActivitySchema } from "./activity";

/**
 * BASE ENTITY SCHEMAS
 */

export const ProjectEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),
    title: z.string(),
    description: z.string().optional(),
    overview: z.string().optional(),
    url: z.url().optional(),
    imagePlaceholderUrl: z.url(),
    tags: z.array(z.string()).optional(),
    projectCreatorType: z.enum(ROLES),
    clientId: z.cuid2().optional(),
    status: z.enum(PROJECT_STATUS),
    clientType: z.enum(CLIENT_TYPES).optional(),
    clientName: z.string().optional(),
    isFeatured: z.boolean().optional(),
    problemBeingSolved: z.string().max(600).optional(),
    whoItsFor: z.string().max(600).optional(),
    ventureStage: z.enum(VENTURE_STAGES).optional(),
    capitalLookingToRaise: z.string(),
    capitalLookingToRaiseCurrency: z.enum(WAGES_CURRENCY).optional(),
    currentTraction: z.string().max(600),
    isOpenToInvestment: z.boolean().default(false),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    version: z.number().int(),
  })
  .openapi("ProjectEntity");

export const MinimalProjectSchema = ProjectEntitySchema.pick({
  id: true,
  title: true,
  description: true,
  tags: true,
  startDate: true,
  endDate: true,
  imagePlaceholderUrl: true,
}).openapi("MinimalProject");

export const ProjectSocialGraphEntitySchema = z
  .object({
    noOfLikes: z.number().int().optional(),
    noOfComments: z.number().int().optional(),
    noOfBookmarks: z.number().int().optional(),
    noOfViews: z.number().int().optional(),
  })
  .openapi("ProjectSocialGraphEntity");

/**
 * INPUT SCHEMAS
 */

export const CreateProjectInputSchema = z
  .object({
    id: z.cuid2().optional(),
    title: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
    overview: z.string().optional(),
    status: z.enum(PROJECT_STATUS).default(PROJECT_STATUS.DRAFT),
  })
  .openapi("CreateProjectInput");

export const UpdateProjectInputSchema = z
  .object({
    id: z.cuid2(),
    title: z.string().optional(),
    description: z.string().optional(),
    overview: z.string().optional(),
    url: z.url().or(z.literal("")).optional(),
    imagePlaceholderUrl: z.url().optional(),
    tags: z.array(z.string()).optional(),
    projectCreatorType: z.enum(ROLES).optional(),
    clientId: z.cuid2().optional(),
    clientType: z.enum(CLIENT_TYPES).optional(),
    clientName: z.string().optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(PROJECT_STATUS).optional(),
    problemBeingSolved: z.string().max(600).optional(),
    whoItsFor: z.string().max(600).optional(),
    ventureStage: z.enum(VENTURE_STAGES).optional(),
    capitalLookingToRaise: z.string().optional(),
    capitalLookingToRaiseCurrency: z.enum(WAGES_CURRENCY).optional(),
    currentTraction: z.string().max(600).optional(),
    isOpenToInvestment: z.boolean().default(false),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    version: z.number().int(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate && startDate > today) {
      ctx.addIssue({
        path: ["startDate"],
        code: "custom",
        message: "Start date cannot be in the future",
      });
    }
    if (startDate && endDate && startDate > endDate) {
      ctx.addIssue({
        path: ["startDate"],
        code: "custom",
        message: "Start date cannot be after end date",
      });
    }
  })
  .openapi("UpdateProjectInput");

export const SearchProjectsInputSchema = z
  .object({
    query: z.string().optional(),
    tags: z.array(z.string()).optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    cursor: z.string().optional(),
  })
  .openapi("SearchProjectsInput");

export const CommentOnProjectInputSchema = CommentEntitySchema;

/**
 * OUTPUT / VIEW SCHEMAS
 */

export const ProjectDetailsEntitySchema = ProjectEntitySchema.extend({
  user: MinimalUserSchema,
}).openapi("ProjectDetailsEntity");

export const GetProjectOutputSchema = ProjectDetailsEntitySchema.extend({
  isLiked: z.boolean().optional(),
  isBookmarked: z.boolean().optional(),
}).openapi("GetProjectOutput");

export const ProjectSearchDocumentSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    imagePlaceholderUrl: z.url(),
    projectCreatorType: z.enum(ROLES),
    createdAt: z.number(),
    updatedAt: z.number(),
    description: z.string().optional(),
    capitalLookingToRaise: z.string().optional(),
    capitalLookingToRaiseCurrency: z.enum(WAGES_CURRENCY).optional(),
    ventureStage: z.enum(VENTURE_STAGES).optional(),
    url: z.url().optional(),
    tags: z.array(z.string()).optional(),
    creatorUsername: z.string(),
    creatorImageUrl: z.string(),
    clientId: z.string().optional(),
    clientType: z.enum(CLIENT_TYPES).optional(),
    clientName: z.string().optional(),
    isFeatured: z.boolean().optional(),
    startDate: z.number().optional(),
    endDate: z.number().optional(),
  })
  .openapi("ProjectSearchDocument");

export const SearchProjectsOutputSchema = z
  .object({
    projects: z.array(ProjectSearchDocumentSchema),
    nextCursor: z.string().optional().nullable(),
  })
  .openapi("SearchProjectsOutput");

export const ProjectWithProjectCommentsEntitySchema =
  MinimalProjectSchema.extend({
    comments: z.array(CommentEntitySchema),
  }).openapi("ProjectWithProjectCommentsEntity");

export const GetProjectWithCommentsOutputSchema =
  ProjectWithProjectCommentsEntitySchema.extend({
    nextCursor: z.string().optional().nullable(),
  }).openapi("GetProjectWithCommentsOutput");

export const ProjectWithLikesEntitySchema = MinimalProjectSchema.extend({
  likes: z.array(
    ActivitySchema.extend({
      followsYou: z.boolean().optional(),
      isFollowing: z.boolean().optional(),
    }),
  ),
}).openapi("ProjectWithLikesEntity");

export const GetProjectWithLikesOutputSchema =
  ProjectWithLikesEntitySchema.extend({
    nextCursor: z.string().optional().nullable(),
  }).openapi("GetProjectWithLikesOutput");

export const ProjectWithProjectViewsEntitySchema = MinimalProjectSchema.extend({
  views: z.array(ViewEntitySchema),
}).openapi("ProjectWithProjectViewsEntity");

export const ProjectWithProjectBookmarksEntitySchema =
  MinimalProjectSchema.extend({
    bookmarks: z.array(BookmarkEntitySchema),
  }).openapi("ProjectWithProjectBookmarksEntity");

export const ProjectUpdateOutputEntitySchema = z.object({
  id: z.cuid2(),
});
export const CreateProjectOutputSchema = ProjectEntitySchema;
export const UpdateProjectOutputSchema = ProjectEntitySchema;
export const DeleteProjectOutputSchema = ProjectEntitySchema;
export const CommentOnProjectOutputSchema = CommentEntitySchema.omit({
  likesCount: true,
  isLiked: true,
});

/**
 * SEARCH & UTILITY SCHEMAS
 */

export const ProjectIdSchema = z.object({ projectId: z.cuid2() });

export const CreateProjectFileInputSchema = z.object({
  key: z.string().max(500),
  projectId: z.cuid2(),
});

export const DeleteProjectFileInputSchema = z.object({
  keys: z.array(z.string()),
});
