import type { z } from "@hono/zod-openapi";
import type {
  ProjectEntitySchema,
  ProjectIdSchema,
  MinimalProjectSchema,
  ProjectFileEntitySchema,
  ProjectDetailsEntitySchema,
  ProjectWithProjectViewsEntitySchema,
  ProjectWithProjectCommentsEntitySchema,
  ProjectWithProjectLikesEntitySchema,
  ProjectWithProjectBookmarksEntitySchema,
  CreateProjectInputSchema,
  CreateProjectOutputSchema,
  UpdateProjectInputSchema,
  UpdateProjectOutputSchema,
  DeleteProjectOutputSchema,
  GetProjectOutputSchema,
  ListProjectsInputSchema,
  ViewProjectInputSchema,
} from "../schemas/project";
import { ViewEntitySchema } from "../schemas/view";
import { LikeEntitySchema } from "../schemas/like";
import { CommentEntitySchema } from "../schemas/comment";

export type ProjectEntity = z.infer<typeof ProjectEntitySchema>;
export type ProjectIdInput = z.infer<typeof ProjectIdSchema>;
export type MinimalProject = z.infer<typeof MinimalProjectSchema>;

export type ProjectFileEntity = z.infer<typeof ProjectFileEntitySchema>;
export type ProjectViewEntity = z.infer<typeof ViewEntitySchema>;
export type ProjectLikeEntity = z.infer<typeof LikeEntitySchema>;
export type ProjectCommentEntity = z.infer<typeof CommentEntitySchema>;

export type ProjectDetailsEntity = z.infer<typeof ProjectDetailsEntitySchema>;
export type ProjectWithProjectViewsEntity = z.infer<
  typeof ProjectWithProjectViewsEntitySchema
>;
export type ProjectWithProjectCommentsEntity = z.infer<
  typeof ProjectWithProjectCommentsEntitySchema
>;
export type ProjectWithProjectLikesEntity = z.infer<
  typeof ProjectWithProjectLikesEntitySchema
>;
export type ProjectWithProjectBookmarksEntity = z.infer<
  typeof ProjectWithProjectBookmarksEntitySchema
>;

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type CreateProjectOutput = z.infer<typeof CreateProjectOutputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
export type UpdateProjectOutput = z.infer<typeof UpdateProjectOutputSchema>;
export type DeleteProjectOutput = z.infer<typeof DeleteProjectOutputSchema>;

export type GetProjectOutput = z.infer<typeof GetProjectOutputSchema>;
export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;
export type ViewProjectInput = z.infer<typeof ViewProjectInputSchema>;
