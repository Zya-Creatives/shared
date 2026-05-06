import { z } from "@hono/zod-openapi";

import {
  APPLICATION_STATUS,
  ApplicationStatus,
  EXPERIENCE_LEVELS,
  ExperienceLevel,
  JOB_AVAILABILITY_TYPES,
  JOB_SECTIONS,
  JOB_TYPE,
  JobAvailabilityTypes,
  JobType,
} from "../constants";

import { NormalizedJobSchema } from "./job";
import { MinimalUserSchema } from "./minimal-user";

/**
 * --------------------------------
 * ENUMS
 * --------------------------------
 */

const ApplicationStatusSchema = z.enum(
  Object.values(APPLICATION_STATUS) as [
    ApplicationStatus,
    ...ApplicationStatus[],
  ],
);

const ExperienceLevelSchema = z.enum(
  Object.values(EXPERIENCE_LEVELS) as [ExperienceLevel, ...ExperienceLevel[]],
);

const JobAvailabilitySchema = z.enum(
  Object.values(JOB_AVAILABILITY_TYPES) as [
    JobAvailabilityTypes,
    ...JobAvailabilityTypes[],
  ],
);

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const JobApplicationShape = z.object({
  jobId: z.cuid2(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  emailAddress: z.email().optional(),
  phoneNumber: z.string().nullable(),
  currentRole: z.string(),
  resumeUrl: z.url(),
  experienceLevel: ExperienceLevelSchema.optional(),
  availability: JobAvailabilitySchema.optional(),
  coverLetter: z.string().nullable(),
  receiveEmailUpdates: z.boolean(),
  wagesAmount: z.number().nullable(),

  workSampleUrls: z
    .array(
      z.object({
        url: z.url(),
        name: z.string().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional(),

  zyaProjects: z
    .array(
      z.object({
        projectName: z.string(),
        projectImgUrl: z.url().optional(),
        projectId: z.cuid2(),
        tags: z.array(z.string()).default([]),
      }),
    )
    .optional(),

  linkUrls: z
    .array(
      z.object({
        url: z.url(),
        isPortfolioUrl: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type JobApplicationShapeType = z.infer<typeof JobApplicationShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const JobApplicationEntitySchema = z
  .object({
    id: z.cuid2(),
    applicantId: z.cuid2(),
    user: MinimalUserSchema,

    ...JobApplicationShape.shape,

    applicationStatus: ApplicationStatusSchema,

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("JobApplication");

export type JobApplicationEntity = z.infer<typeof JobApplicationEntitySchema>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */

export const MinimalJobApplicationEntitySchema = z.object({
  id: z.cuid2(),
  jobId: z.cuid2(),
  user: MinimalUserSchema,
  coverLetter: z.string(),
  applicationStatus: ApplicationStatusSchema,
  createdAt: z.iso.datetime(),
});

export type MinimalJobApplicationEntity = z.infer<
  typeof MinimalJobApplicationEntitySchema
>;

export const TrackedJobApplicationEntitySchema = z.object({
  id: z.cuid2(),
  applicationStatus: ApplicationStatusSchema,
  createdAt: z.iso.datetime(),
  job: NormalizedJobSchema,
});

export type TrackedJobApplicationEntity = z.infer<
  typeof TrackedJobApplicationEntitySchema
>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateJobApplicationInputSchema = JobApplicationShape.extend({
  jobSections: z.array(z.enum(JOB_SECTIONS)).optional(),
});

export type CreateJobApplicationInput = z.infer<
  typeof CreateJobApplicationInputSchema
>;

export const UpdateJobApplicationInputSchema =
  CreateJobApplicationInputSchema.partial().extend({
    id: z.cuid2(),
    applicationStatus: ApplicationStatusSchema.optional(),
  });

export type UpdateJobApplicationInput = z.infer<
  typeof UpdateJobApplicationInputSchema
>;

export const GetTrackedJobApplicationsInputSchema = z.object({
  query: z.string().optional(),
  status: ApplicationStatusSchema.optional(),
  jobType: z
    .enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type GetTrackedJobApplicationsInput = z.infer<
  typeof GetTrackedJobApplicationsInputSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const GetTrackedJobApplicationsOutputSchema = z.object({
  applications: z.array(TrackedJobApplicationEntitySchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type GetTrackedJobApplicationsOutput = z.infer<
  typeof GetTrackedJobApplicationsOutputSchema
>;

export const BaseJobApplicationEntitySchema = JobApplicationEntitySchema.omit({
  user: true,
});

export type BaseJobApplicationEntity = z.infer<
  typeof BaseJobApplicationEntitySchema
>;
