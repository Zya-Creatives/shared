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
import { ActivitySchema } from "./activity";
import { FileEntitySchema } from "./file";
import { LikeEntitySchema } from "./like";
import { MinimalUserSchema } from "./minimal-user";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const ProjectShape = z.object({
  title: z.string(),
  description: z.string().optional(),
  overview: z.string().optional(),
  url: z.url().optional(),

  imagePlaceholderUrl: z.url(),

  tags: z.array(z.string()).optional(),

  projectCreatorType: z.enum(ROLES),

  clientId: z.cuid2().optional(),
  clientType: z.enum(CLIENT_TYPES).optional(),
  clientName: z.string().optional(),

  status: z.enum(PROJECT_STATUS),

  isFeatured: z.boolean().optional(),

  problemBeingSolved: z.string().max(600).optional(),
  whoItsFor: z.string().max(600).optional(),

  ventureStage: z.enum(VENTURE_STAGES).optional(),
  capitalLookingToRaise: z.number(),
  capitalLookingToRaiseCurrency: z.enum(WAGES_CURRENCY).optional(),

  currentTraction: z.string().max(600),
  isOpenToInvestment: z.boolean().default(false),

  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

export type ProjectShapeType = z.infer<typeof ProjectShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const ProjectEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),

    ...ProjectShape.shape,

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    version: z.int(),
  })
  .openapi("Project");

export type ProjectEntity = z.infer<typeof ProjectEntitySchema>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */

export const ProjectWithFilesEntitySchema = ProjectEntitySchema.extend({
  files: z.array(FileEntitySchema).optional(),
}).openapi("ProjectWithFiles");

export type ProjectWithFilesEntity = z.infer<
  typeof ProjectWithFilesEntitySchema
>;

export const MinimalProjectSchema = ProjectEntitySchema.pick({
  id: true,
  title: true,
  description: true,
  tags: true,
  startDate: true,
  endDate: true,
  imagePlaceholderUrl: true,
}).openapi("MinimalProject");

export type MinimalProject = z.infer<typeof MinimalProjectSchema>;

export const ProjectSocialGraphEntitySchema = z
  .object({
    noOfLikes: z.number().int().optional(),
    noOfComments: z.number().int().optional(),
    noOfBookmarks: z.number().int().optional(),
    noOfViews: z.number().int().optional(),
  })
  .openapi("ProjectSocialGraph");

export type ProjectSocialGraphEntity = z.infer<
  typeof ProjectSocialGraphEntitySchema
>;

export type PostSocialGraphEntity = z.infer<
  typeof ProjectSocialGraphEntitySchema
>;

export const ProjectDetailsEntitySchema = ProjectEntitySchema.extend({
  user: MinimalUserSchema,
  files: z.array(FileEntitySchema).optional(),
}).openapi("ProjectDetails");

export type ProjectDetailsEntity = z.infer<typeof ProjectDetailsEntitySchema>;

export const ProjectWithProjectCommentsEntitySchema =
  MinimalProjectSchema.extend({
    comments: z.array(CommentEntitySchema),
  }).openapi("ProjectWithProjectComments");

export type ProjectWithProjectCommentsEntity = z.infer<
  typeof ProjectWithProjectCommentsEntitySchema
>;

export const ProjectWithLikesEntitySchema = MinimalProjectSchema.extend({
  likes: z.array(
    ActivitySchema.extend({
      followsYou: z.boolean().optional(),
      isFollowing: z.boolean().optional(),
    }),
  ),
}).openapi("ProjectWithLikes");

export type ProjectWithLikesEntity = z.infer<
  typeof ProjectWithLikesEntitySchema
>;

export const ProjectWithProjectBookmarksEntitySchema =
  MinimalProjectSchema.extend({
    bookmarks: z.array(BookmarkEntitySchema),
  }).openapi("ProjectWithProjectBookmarks");

export type ProjectWithProjectBookmarksEntity = z.infer<
  typeof ProjectWithProjectBookmarksEntitySchema
>;

/**
 * --------------------------------
 * INPUT HELPERS
 * --------------------------------
 */

const coerceArray = (value: unknown) => {
  if (typeof value === "string") return value === "" ? [] : value.split(",");
  return value;
};

const coerceBoolean = (value: unknown) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

const nullableStringToUndefined = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
};

const urlInputSchema = z
  .string()
  .transform((value) => {
    if (!value) return value;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return `https://${value}`;
  })
  .pipe(z.url().or(z.literal("")));

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
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

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

export const UpdateProjectInputSchema = z
  .object({
    id: z.cuid2(),

    title: z.string().optional(),

    description: z
      .string()
      .min(10, "Add a bit more detail to your description.")
      .optional(),

    overview: z.string().optional(),

    url: urlInputSchema.optional(),

    imagePlaceholderUrl: z.url().optional().or(z.literal("")),

    tags: z.array(z.string()).optional(),

    projectCreatorType: z.enum(ROLES).optional(),

    clientId: z.preprocess(nullableStringToUndefined, z.cuid2().optional()),

    clientType: z.enum(CLIENT_TYPES).optional(),
    clientName: z.string().optional(),

    isFeatured: z.boolean().optional(),

    status: z.enum(PROJECT_STATUS).optional(),

    problemBeingSolved: z
      .string()
      .min(20, "Describe the problem you're solving.")
      .max(600)
      .optional(),

    whoItsFor: z
      .string()
      .min(5, "Tell us who this is for.")
      .max(600)
      .optional(),

    ventureStage: z.enum(VENTURE_STAGES).optional(),

    capitalLookingToRaise: z.number().optional(),
    capitalLookingToRaiseCurrency: z.enum(WAGES_CURRENCY).optional(),

    currentTraction: z
      .string()
      .min(10, "Share your current traction.")
      .max(600)
      .optional(),

    isOpenToInvestment: z.boolean().optional(),

    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),

    version: z.int().optional(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (!startDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    if (parsedStartDate > today) {
      ctx.addIssue({
        path: ["startDate"],
        code: "custom",
        message: "Start date cannot be in the future.",
      });
    }

    if (parsedEndDate && parsedStartDate > parsedEndDate) {
      ctx.addIssue({
        path: ["endDate"],
        code: "custom",
        message: "End date must be after the start date.",
      });
    }
  })
  .openapi("UpdateProjectInput");

export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;

export const CommentOnProjectInputSchema = CommentEntitySchema;

export type CommentOnProjectInput = z.infer<typeof CommentOnProjectInputSchema>;

export const SearchProjectsInputSchema = z
  .object({
    query: z.string().optional(),

    limit: z.coerce.number().min(1).max(100).default(40),
    cursor: z.string().optional(),

    tags: z.preprocess(coerceArray, z.array(z.string())).optional(),

    isOpenToInvestment: z.preprocess(coerceBoolean, z.boolean()).optional(),

    minCapital: z.coerce.number().optional(),
    maxCapital: z.coerce.number().optional(),

    ventureStages: z
      .preprocess(coerceArray, z.array(z.enum(VENTURE_STAGES)))
      .optional(),

    projectCreatorTypes: z
      .preprocess(coerceArray, z.array(z.enum(ROLES)))
      .optional(),

    clientTypes: z
      .preprocess(coerceArray, z.array(z.enum(CLIENT_TYPES)))
      .optional(),
  })
  .openapi("SearchProjectsInput");

export type SearchProjectsInput = z.infer<typeof SearchProjectsInputSchema>;

export const ProjectIdSchema = z.object({
  projectId: z.cuid2(),
});

export type ProjectIdInput = z.infer<typeof ProjectIdSchema>;

/**
 * --------------------------------
 * SEARCH DOCUMENT
 * --------------------------------
 */

export const ProjectSearchDocumentSchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),

    title: z.string(),
    imagePlaceholderUrl: z.url(),

    projectCreatorType: z.enum(ROLES),
    isOpenToInvestment: z.boolean(),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),

    description: z.string().optional(),

    capitalLookingToRaise: z.number().optional(),
    capitalLookingToRaiseCurrency: z.enum(WAGES_CURRENCY).optional(),
    ventureStage: z.enum(VENTURE_STAGES).optional(),

    url: z.url().optional(),
    tags: z.array(z.string()).optional(),

    creatorUsername: z.string(),
    creatorImageUrl: z.string(),
    creatorName: z.string(),

    clientId: z.cuid2().optional(),
    clientType: z.enum(CLIENT_TYPES).optional(),
    clientName: z.string().optional(),

    isFeatured: z.boolean().optional(),

    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),

    files: z.array(FileEntitySchema).optional(),
    isBookmarked: z.boolean().default(false),
    canComment: z.boolean()
  })
  .openapi("ProjectSearchDocument");

export type ProjectSearchDocument = z.infer<typeof ProjectSearchDocumentSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const GetProjectOutputSchema = ProjectDetailsEntitySchema.extend({
  isLiked: z.boolean().optional(),
  isBookmarked: z.boolean().optional(),
  canComment: z.boolean()
}).openapi("GetProjectOutput");

export type GetProjectOutput = z.infer<typeof GetProjectOutputSchema>;

export const SearchProjectsOutputSchema = z
  .object({
    projects: z.array(ProjectSearchDocumentSchema),
    nextCursor: z.string().optional(),
  })
  .openapi("SearchProjectsOutput");

export type SearchProjectsOutput = z.infer<typeof SearchProjectsOutputSchema>;

export const GetProjectWithCommentsOutputSchema =
  ProjectWithProjectCommentsEntitySchema.extend({
    nextCursor: z.string().optional(),
  }).openapi("GetProjectWithCommentsOutput");

export type GetProjectWithCommentsOutput = z.infer<
  typeof GetProjectWithCommentsOutputSchema
>;

export const GetProjectWithLikesOutputSchema =
  ProjectWithLikesEntitySchema.extend({
    nextCursor: z.string().optional(),
  }).openapi("GetProjectWithLikesOutput");

export type GetProjectWithLikesOutput = z.infer<
  typeof GetProjectWithLikesOutputSchema
>;

export const ProjectUpdateOutputEntitySchema = z.object({
  id: z.cuid2(),
});

export type ProjectUpdateOutputEntity = z.infer<
  typeof ProjectUpdateOutputEntitySchema
>;

export const CreateProjectOutputSchema = ProjectEntitySchema;

export type CreateProjectOutput = z.infer<typeof CreateProjectOutputSchema>;

export const UpdateProjectOutputSchema = ProjectEntitySchema;

export type UpdateProjectOutput = z.infer<typeof UpdateProjectOutputSchema>;

export const DeleteProjectOutputSchema = ProjectEntitySchema;

export type DeleteProjectOutput = z.infer<typeof DeleteProjectOutputSchema>;

export const CommentOnProjectOutputSchema = CommentEntitySchema.omit({
  likesCount: true,
  isLiked: true,
});

export type CommentOnProjectOutput = z.infer<
  typeof CommentOnProjectOutputSchema
>;

/**
 * --------------------------------
 * ALIASES
 * --------------------------------
 */

export type ProjectLikeEntity = z.infer<typeof LikeEntitySchema>;
export type ProjectCommentEntity = z.infer<typeof CommentEntitySchema>;
