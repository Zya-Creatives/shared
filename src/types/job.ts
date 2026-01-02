import { z } from "zod";
import {
  JobEntitySchema,
  GigJobEntitySchema,
  RoleJobEntitySchema,
  CreateJobInputSchema,
  CreateRoleJobInputSchema,
  CreateGigJobInputSchema,
  UpdateRoleJobInputSchema,
  UpdateGigJobInputSchema,
  UpdateJobInputSchema,
  JobWithGigDetailsEntitySchema,
  JobWithRoleDetailsEntitySchema,
  BaseJobEntitySchema,
  JobIdSchema,
  GetJobsOutputSchema,
  GetJobsInputSchema,
  GetCreatedJobsOutputSchema,
} from "../schemas/job";

export type BaseJobEntity = z.infer<typeof BaseJobEntitySchema>;

export type JobIdInput = z.infer<typeof JobIdSchema>;

export type JobEntity = z.infer<typeof JobEntitySchema>;

export type GigJobEntity = z.infer<typeof GigJobEntitySchema>;

export type RoleJobEntity = z.infer<typeof RoleJobEntitySchema>;

export type CreateJobInput = z.infer<typeof CreateJobInputSchema>;

export type CreateJobOutput = z.infer<typeof BaseJobEntitySchema>;

export type CreateRoleJobInput = z.infer<typeof CreateRoleJobInputSchema>;

export type CreateRoleJobOutput = z.infer<typeof RoleJobEntitySchema>;

export type CreateGigJobInput = z.infer<typeof CreateGigJobInputSchema>;

export type CreateGigJobOutput = z.infer<typeof GigJobEntitySchema>;

export type UpdateRoleJobInput = z.infer<typeof UpdateRoleJobInputSchema>;

export type UpdateRoleJobOutput = z.infer<typeof RoleJobEntitySchema>;

export type UpdateGigJobInput = z.infer<typeof UpdateGigJobInputSchema>;

export type UpdateGigJobOutput = z.infer<typeof GigJobEntitySchema>;

export type UpdateJobInput = z.infer<typeof UpdateJobInputSchema>;

export type UpdateJobOutput = z.infer<typeof BaseJobEntitySchema>;

export type GetJobOutput = z.infer<typeof BaseJobEntitySchema>;

export type JobWithGigDetailsEntity = z.infer<
  typeof JobWithGigDetailsEntitySchema
>;

export type JobWithRoleDetailsEntity = z.infer<
  typeof JobWithRoleDetailsEntitySchema
>;

export type GetJobsInput = z.infer<typeof GetJobsInputSchema>;
export type GetJobsOutput = z.infer<typeof GetJobsOutputSchema>;
export type GetCreatedJobsOutput = z.infer<typeof GetCreatedJobsOutputSchema>;
export type NormalizedJobEntity =
  | JobEntity
  | JobWithGigDetailsEntity
  | JobWithRoleDetailsEntity;
