// job-application.schemas.ts

import { z } from "@hono/zod-openapi";

import {
  APPLICATION_STATUS,
  EXPERIENCE_LEVELS,
  JOB_AVAILABILITY_TYPES,
  JOB_SECTIONS,
  JOB_TYPE,
} from "../constants";

import { NormalizedJobSchema } from "./job";
import { MinimalUserSchema } from "./minimal-user";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

export const JobApplicationShape = z.object({
  jobId: z.cuid2(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  emailAddress: z.email().optional(),
  phoneNumber: z.string().nullable(),
  currentRole: z.string(),
  resumeUrl: z.url(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
  availability: z.enum(JOB_AVAILABILITY_TYPES).optional(),
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
 * RESPONSE / OFFER / STATUS TRACKING
 * --------------------------------
 */

export const JobApplicationResponseSchema = z.object({
  brandResponseMessage: z.string().max(3000).nullable().optional(),
  meetingLink: z.url().nullable().optional(),

  offerAcceptedAt: z.iso.datetime().nullable().optional(),
  offerDeclinedAt: z.iso.datetime().nullable().optional(),
  hiredAt: z.iso.datetime().nullable().optional(),
  rejectedAt: z.iso.datetime().nullable().optional(),

  lastStatusChangedAt: z.iso.datetime().nullable().optional(),
  lastStatusViewedByApplicantAt: z.iso.datetime().nullable().optional(),
  lastStatusViewedByBrandAt: z.iso.datetime().nullable().optional(),
  lastUpdatedByUserId: z.cuid2().nullable().optional(),

  hasUnreadStatusUpdate: z.boolean().default(false).optional(),
});

export type JobApplicationResponse = z.infer<
  typeof JobApplicationResponseSchema
>;

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
    ...JobApplicationResponseSchema.shape,

    applicationStatus: z.enum(APPLICATION_STATUS),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("JobApplication");

export type JobApplicationEntity = z.infer<typeof JobApplicationEntitySchema>;

export const BaseJobApplicationEntitySchema = JobApplicationEntitySchema.omit({
  user: true,
});

export type BaseJobApplicationEntity = z.infer<
  typeof BaseJobApplicationEntitySchema
>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */

export const MinimalJobApplicationEntitySchema = z.object({
  id: z.cuid2(),
  jobId: z.cuid2(),
  user: MinimalUserSchema,
  coverLetter: z.string().nullable(),
  applicationStatus: z.enum(APPLICATION_STATUS),

  brandResponseMessage: z.string().nullable().optional(),
  meetingLink: z.url().nullable().optional(),

  offerAcceptedAt: z.iso.datetime().nullable().optional(),
  offerDeclinedAt: z.iso.datetime().nullable().optional(),

  lastStatusChangedAt: z.iso.datetime().nullable().optional(),
  hasUnreadStatusUpdate: z.boolean().default(false).optional(),

  createdAt: z.iso.datetime(),
});

export type MinimalJobApplicationEntity = z.infer<
  typeof MinimalJobApplicationEntitySchema
>;

export const TrackedJobApplicationEntitySchema = z.object({
  id: z.cuid2(),
  applicationStatus: z.enum(APPLICATION_STATUS),

  brandResponseMessage: z.string().nullable().optional(),
  meetingLink: z.url().nullable().optional(),

  offerAcceptedAt: z.iso.datetime().nullable().optional(),
  offerDeclinedAt: z.iso.datetime().nullable().optional(),

  lastStatusChangedAt: z.iso.datetime().nullable().optional(),
  hasUnreadStatusUpdate: z.boolean().default(false).optional(),

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().optional(),

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

export const ApplicationIdInputSchema = z.object({
  id: z.cuid2(),
});

export type ApplicationIdInput = z.infer<typeof ApplicationIdInputSchema>;

export const JobApplicationIdInputSchema = z.object({
  applicationId: z
    .string()
    .openapi({ param: { name: "applicationId", in: "path" } }),
});

export type JobApplicationIdInput = z.infer<
  typeof JobApplicationIdInputSchema
>;

export const CreateJobApplicationInputSchema = JobApplicationShape.extend({
  jobSections: z.array(z.enum(JOB_SECTIONS)).optional(),
});

export type CreateJobApplicationInput = z.infer<
  typeof CreateJobApplicationInputSchema
>;

export const UpdateJobApplicationInputSchema =
  CreateJobApplicationInputSchema.partial().extend({
    id: z.cuid2(),

    applicationStatus: z.enum(APPLICATION_STATUS).optional(),

    brandResponseMessage: z.string().max(3000).nullable().optional(),
    meetingLink: z.url().nullable().optional(),

    offerAcceptedAt: z.iso.datetime().nullable().optional(),
    offerDeclinedAt: z.iso.datetime().nullable().optional(),

    lastStatusViewedByApplicantAt: z.iso.datetime().nullable().optional(),
    lastStatusViewedByBrandAt: z.iso.datetime().nullable().optional(),
  });

export type UpdateJobApplicationInput = z.infer<
  typeof UpdateJobApplicationInputSchema
>;

export const GetTrackedJobApplicationsInputSchema = z.object({
  query: z.string().optional(),
  status: z.enum(APPLICATION_STATUS).optional(),
  jobType: z.enum(JOB_TYPE).optional(),
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

export const GetApplicationStatusUpdatesCountOutputSchema = z.object({
  unreadCount: z.number(),
});

export type GetApplicationStatusUpdatesCountOutput = z.infer<
  typeof GetApplicationStatusUpdatesCountOutputSchema
>;

export const GetBrandUnansweredApplicationsOutputSchema = z.object({
  unansweredCount: z.number(),
});

export type GetBrandUnansweredApplicationsOutput = z.infer<
  typeof GetBrandUnansweredApplicationsOutputSchema
>;

export const GetApplicationsForJobOutputSchema = z.object({
  applications: z.array(MinimalJobApplicationEntitySchema),
  nextCursor: z.string().optional(),
});

export type GetApplicationsForJobOutput = z.infer<
  typeof GetApplicationsForJobOutputSchema
>;
