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
import { MinimalUserSchema } from "./user";
import { NormalizedJobSchema } from "./job";

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

export const MinimalJobApplicationEntitySchema = z.object({
  user: MinimalUserSchema,
  jobId: z.cuid2(),
  id: z.cuid2(),
  coverLetter: z.string(),
  createdAt: z.coerce.date(),
  applicationStatus: ApplicationStatusSchema,
});

export type MinimalJobApplicationEntity = z.infer<
  typeof MinimalJobApplicationEntitySchema
>;

export const BaseJobApplicationEntitySchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  availability: z.enum(JOB_AVAILABILITY_TYPES).optional(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
  jobId: z.string(),
  applicantId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  emailAddress: z.string().optional(),
  phoneNumber: z.string().nullable(),
  currentRole: z.string(),
  resumeUrl: z.url(),
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
        projectId: z.string(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  applicationStatus: ApplicationStatusSchema,
  linkUrls: z
    .array(
      z.object({
        url: z.url(),
        isPortfolioUrl: z.boolean().optional(),
      }),
    )
    .optional(),
  coverLetter: z.string().nullable(),
  receiveEmailUpdates: z.boolean(),
  wagesAmount: z.number().nullable(),
});

export type BaseJobApplicationEntity = z.infer<
  typeof BaseJobApplicationEntitySchema
>;

export const JobApplicationEntitySchema = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  jobId: z.cuid2(),
  user: MinimalUserSchema,
  emailAddress: z.email().optional(),
  phoneNumber: z.string().optional(),
  currentRole: z.string().optional(),
  experienceLevel: ExperienceLevelSchema.optional(),
  resumeUrl: z.url(),
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
        projectImgUrl: z.url(),
        projectId: z.cuid2(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  applicationStatus: ApplicationStatusSchema.default("Application Sent"),
  applicantId: z.cuid2(),
  linkUrls: z
    .array(
      z.object({ url: z.url(), isPortfolioUrl: z.boolean().default(false) }),
    )
    .optional(),
  coverLetter: z.string().optional(),
  receiveEmailUpdates: z.boolean().optional(),
  wagesAmount: z.coerce.number().optional(),
  availability: JobAvailabilitySchema.optional(),
  createdAt: z.coerce
    .date()
    .optional()
    .openapi({ example: "2025-10-13T09:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ example: "2025-10-13T09:00:00.000Z" }),
});

export type JobApplicationEntity = z.infer<typeof JobApplicationEntitySchema>;

export const CreateJobApplicationInputSchema = z.object({
  jobId: z.cuid2(),
  applicantId: z.cuid2(),
  jobSections: z.array(z.enum(JOB_SECTIONS)).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  emailAddress: z.email().optional(),
  phoneNumber: z.string().optional(),
  currentRole: z.string().optional(),
  experienceLevel: ExperienceLevelSchema.optional(),
  resumeUrl: z.url().optional(),
  coverLetter: z.string().optional(),
  availability: z.enum(JOB_AVAILABILITY_TYPES).optional(),
  wagesAmount: z.coerce.number().optional(),
  receiveEmailUpdates: z.boolean().optional(),
  workSampleUrls: z
    .array(
      z.object({
        url: z.url(),
        name: z.string().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional(),
  linkUrls: z
    .array(z.object({ url: z.url(), isPortfolioUrl: z.boolean() }))
    .optional(),
  zyaProjects: z
    .array(
      z.object({
        projectName: z.string(),
        projectId: z.cuid2(),
        projectImgUrl: z.url(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

export type CreateJobApplicationInput = z.infer<
  typeof CreateJobApplicationInputSchema
>;

export const TrackedJobApplicationEntitySchema = z.object({
  id: z.cuid2(),
  createdAt: z.coerce.date(),
  applicationStatus: ApplicationStatusSchema,
  job: NormalizedJobSchema,
});

export type TrackedJobApplicationEntity = z.infer<
  typeof TrackedJobApplicationEntitySchema
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
