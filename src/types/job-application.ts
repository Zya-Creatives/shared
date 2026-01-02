import z from "zod";
import {
  JobApplicationEntitySchema,
  CreateJobApplicationInputSchema,
  UpdateJobApplicationInputSchema,
  MinimalJobApplicationEntitySchema,
  BaseJobApplicationEntitySchema,
  TrackedJobApplicationEntitySchema,
  GetTrackedJobApplicationsInputSchema,
  GetTrackedJobApplicationsOutputSchema,
} from "../schemas/job-application";

export type CreateJobApplicationInput = z.infer<
  typeof CreateJobApplicationInputSchema
>;

export type UpdateJobApplicationInput = z.infer<
  typeof UpdateJobApplicationInputSchema
>;

export type JobApplicationEntity = z.infer<typeof JobApplicationEntitySchema>;

export type MinimalJobApplicationEntity = z.infer<
  typeof MinimalJobApplicationEntitySchema
>;

export type BaseJobApplicationEntity = z.infer<
  typeof BaseJobApplicationEntitySchema
>;

export type TrackedJobApplicationEntity = z.infer<
  typeof TrackedJobApplicationEntitySchema
>;

export type GetTrackedJobApplicationsInput = z.infer<
  typeof GetTrackedJobApplicationsInputSchema
>;

export type GetTrackedJobApplicationsOutput = z.infer<
  typeof GetTrackedJobApplicationsOutputSchema
>;
