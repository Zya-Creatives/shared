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
import { MinimalUserSchema } from "./user";
import { ActivitySchema } from "./activity";
import { FileEntitySchema } from "./file";
import { LikeEntitySchema } from "./like";

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
    capitalLookingToRaise: z.number(),
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

export type ProjectEntity = z.infer<typeof ProjectEntitySchema>;

export const ProjectWithFilesEntitySchema = ProjectEntitySchema.extend({
  files: z.array(FileEntitySchema).optional(),
}).openapi("ProjectWithFilesEntity");

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
  .openapi("ProjectSocialGraphEntity");

export type ProjectSocialGraphEntity = z.infer<
  typeof ProjectSocialGraphEntitySchema
>;
export type PostSocialGraphEntity = z.infer<
  typeof ProjectSocialGraphEntitySchema
>;

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
    url: z
      .string()
      .transform((val) => {
        if (!val) return val;
        if (val.startsWith("http://") || val.startsWith("https://")) return val;
        return `https://${val}`;
      })
      .pipe(z.url("Check your link.").or(z.literal("")))
      .optional(),
    imagePlaceholderUrl: z.url().optional().or(z.literal("")),
    tags: z.array(z.string()).optional(),
    projectCreatorType: z.enum(ROLES).optional(),
    clientId: z
      .string()
      .optional()
      .transform((val) => (val === "" || val === undefined ? undefined : val))
      .pipe(z.cuid2().optional()),
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
    isOpenToInvestment: z.boolean().default(false),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    version: z.number().int().default(1),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate && startDate > today) {
      ctx.addIssue({
        path: ["startDate"],
        code: "custom",
        message: "Start date cannot be in the future.",
      });
    }
    if (startDate && endDate && startDate > endDate) {
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

export const ProjectDetailsEntitySchema = ProjectEntitySchema.extend({
  user: MinimalUserSchema,
  files: z.array(FileEntitySchema).optional(),
}).openapi("ProjectDetailsEntity");

export type ProjectDetailsEntity = z.infer<typeof ProjectDetailsEntitySchema>;

export const GetProjectOutputSchema = ProjectDetailsEntitySchema.extend({
  isLiked: z.boolean().optional(),
  isBookmarked: z.boolean().optional(),
}).openapi("GetProjectOutput");

export type GetProjectOutput = z.infer<typeof GetProjectOutputSchema>;

export const ProjectSearchDocumentSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    imagePlaceholderUrl: z.url(),
    projectCreatorType: z.enum(ROLES),
    isOpenToInvestment: z.boolean(),
    createdAt: z.number(),
    updatedAt: z.number(),
    description: z.string().optional(),
    capitalLookingToRaise: z.number().optional(),
    capitalLookingToRaiseCurrency: z.enum(WAGES_CURRENCY).optional(),
    ventureStage: z.enum(VENTURE_STAGES).optional(),
    url: z.url().optional(),
    tags: z.array(z.string()).optional(),
    creatorUsername: z.string(),
    creatorImageUrl: z.string(),
    creatorName: z.string(),
    clientId: z.string().optional(),
    clientType: z.enum(CLIENT_TYPES).optional(),
    clientName: z.string().optional(),
    isFeatured: z.boolean().optional(),
    startDate: z.number().optional(),
    endDate: z.number().optional(),
    files: z.array(FileEntitySchema).optional(),
  })
  .openapi("ProjectSearchDocument");

export type ProjectSearchDocument = z.infer<typeof ProjectSearchDocumentSchema>;

const coerceArray = (val: unknown) => {
  if (typeof val === "string") return val === "" ? [] : val.split(",");
  return val;
};

const coerceBoolean = (val: unknown) => {
  if (val === "true") return true;
  if (val === "false") return false;
  return val;
};

export const SearchProjectsInputSchema = z
  .object({
    query: z.string().optional(),

    limit: z.coerce.number().optional().default(40),
    cursor: z.string().optional().nullable(),

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

export const SearchProjectsOutputSchema = z
  .object({
    projects: z.array(ProjectSearchDocumentSchema),
    nextCursor: z.string().optional().nullable(),
  })
  .openapi("SearchProjectsOutput");

export type SearchProjectsOutput = z.infer<typeof SearchProjectsOutputSchema>;

export const ProjectWithProjectCommentsEntitySchema =
  MinimalProjectSchema.extend({
    comments: z.array(CommentEntitySchema),
  }).openapi("ProjectWithProjectCommentsEntity");

export type ProjectWithProjectCommentsEntity = z.infer<
  typeof ProjectWithProjectCommentsEntitySchema
>;

export const GetProjectWithCommentsOutputSchema =
  ProjectWithProjectCommentsEntitySchema.extend({
    nextCursor: z.string().optional().nullable(),
  }).openapi("GetProjectWithCommentsOutput");

export type GetProjectWithCommentsOutput = z.infer<
  typeof GetProjectWithCommentsOutputSchema
>;

export const ProjectWithLikesEntitySchema = MinimalProjectSchema.extend({
  likes: z.array(
    ActivitySchema.extend({
      followsYou: z.boolean().optional(),
      isFollowing: z.boolean().optional(),
    }),
  ),
}).openapi("ProjectWithLikesEntity");

export type ProjectWithLikesEntity = z.infer<
  typeof ProjectWithLikesEntitySchema
>;

export const GetProjectWithLikesOutputSchema =
  ProjectWithLikesEntitySchema.extend({
    nextCursor: z.string().optional().nullable(),
  }).openapi("GetProjectWithLikesOutput");

export type GetProjectWithLikesOutput = z.infer<
  typeof GetProjectWithLikesOutputSchema
>;

export const ProjectWithProjectBookmarksEntitySchema =
  MinimalProjectSchema.extend({
    bookmarks: z.array(BookmarkEntitySchema),
  }).openapi("ProjectWithProjectBookmarksEntity");

export type ProjectWithProjectBookmarksEntity = z.infer<
  typeof ProjectWithProjectBookmarksEntitySchema
>;

export const ProjectUpdateOutputEntitySchema = z.object({
  id: z.cuid2(),
});

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

export const ProjectIdSchema = z.object({ projectId: z.cuid2() });
export type ProjectIdInput = z.infer<typeof ProjectIdSchema>;

export type ProjectLikeEntity = z.infer<typeof LikeEntitySchema>;
export type ProjectCommentEntity = z.infer<typeof CommentEntitySchema>;
