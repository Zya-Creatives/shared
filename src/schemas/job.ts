// job.schemas.ts

import { z } from "@hono/zod-openapi";

import {
  EMPLOYMENT_TYPE,
  EXPERIENCE_LEVELS,
  GIG_TYPE,
  JOB_LOCATIONS,
  JOB_SECTIONS,
  JOB_STATUS,
  JOB_TYPE,
  WAGES_CURRENCY,
  WAGE_TYPES,
  WORK_MODE,
} from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

export const JobCleanupSchema = z.object({
  maxApplications: z.number().int().positive().nullable().optional(),
  maxHires: z.number().int().positive().nullable().optional(),
  applicationDeadline: z.iso.datetime().nullable().optional(),
  autoArchiveWhenFilled: z.boolean().default(true).optional(),
});

export type JobCleanup = z.infer<typeof JobCleanupSchema>;

export const JobShape = z.object({
  title: z.string().min(3).max(255),
  brandId: z.cuid2(),
  jobType: z.enum(JOB_TYPE),
  employmentType: z.enum(EMPLOYMENT_TYPE).optional(),
  workMode: z.enum(WORK_MODE),
  gigType: z.enum(GIG_TYPE).optional(),
  location: z.enum(JOB_LOCATIONS),
  jobSections: z.array(z.enum(JOB_SECTIONS)),

  ...JobCleanupSchema.shape,
});

export type JobShapeType = z.infer<typeof JobShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const JobEntitySchema = z
  .object({
    id: z.cuid2(),

    ...JobShape.shape,

    status: z.enum(JOB_STATUS),

    brandName: z.string(),
    brandImgUrl: z.string().nullable().optional(),

    isApplied: z.boolean().default(false),
    isBookmarked: z.boolean(),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    version: z.int(),
  })
  .openapi("Job");

export type JobEntity = z.infer<typeof JobEntitySchema>;

export const BaseJobEntitySchema = JobEntitySchema;
export type BaseJobEntity = z.infer<typeof BaseJobEntitySchema>;

/**
 * --------------------------------
 * ROLE / GIG DETAILS
 * --------------------------------
 */

export const GigDetailsSchema = z.object({
  overview: z.string(),
  deliverables: z.string(),
  employeeRequirements: z.string().optional(),
  aboutCompany: z.string().optional(),
  requiredSkills: z.array(z.string()),
  wagesMin: z.number().nullable().optional(),
  wagesMax: z.number().nullable().optional(),
  wagesCurrency: z.enum(WAGES_CURRENCY).optional(),
  wagesType: z.enum(WAGE_TYPES).optional(),
});

export type GigDetails = z.infer<typeof GigDetailsSchema>;

export const RoleDetailsSchema = z.object({
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  overview: z.string(),
  keyResponsibilities: z.string(),
  requiredSkills: z.array(z.string()),
  employeeRequirements: z.string().optional(),
  companyBenefits: z.string().optional(),
  wagesMin: z.number().nullable().optional(),
  wagesMax: z.number().nullable().optional(),
  wagesCurrency: z.enum(WAGES_CURRENCY).optional(),
  wagesType: z.enum(WAGE_TYPES).optional(),
});

export type RoleDetails = z.infer<typeof RoleDetailsSchema>;

/**
 * --------------------------------
 * DETAILED ENTITIES
 * --------------------------------
 */

export const GigJobEntitySchema = JobEntitySchema.extend({
  jobType: z.literal(JOB_TYPE.GIG),
  gigType: z.enum(GIG_TYPE),
  employmentType: z.enum(EMPLOYMENT_TYPE).optional(),
  ...GigDetailsSchema.shape,
}).openapi("GigJob");

export type GigJobEntity = z.infer<typeof GigJobEntitySchema>;

export const RoleJobEntitySchema = JobEntitySchema.extend({
  jobType: z.literal(JOB_TYPE.ROLE),
  employmentType: z.enum(EMPLOYMENT_TYPE),
  gigType: z.enum(GIG_TYPE).optional(),
  ...RoleDetailsSchema.shape,
}).openapi("RoleJob");

export type RoleJobEntity = z.infer<typeof RoleJobEntitySchema>;

/**
 * Backwards-compatible names.
 */
export const JobWithGigDetailsEntitySchema = GigJobEntitySchema;
export type JobWithGigDetailsEntity = GigJobEntity;

export const JobWithRoleDetailsEntitySchema = RoleJobEntitySchema;
export type JobWithRoleDetailsEntity = RoleJobEntity;

/**
 * Keep this as a regular union.
 */
export const NormalizedJobSchema = z.union([
  GigJobEntitySchema,
  RoleJobEntitySchema,
  JobEntitySchema,
]);

export type NormalizedJobEntity = z.infer<typeof NormalizedJobSchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const JobIdSchema = z.object({
  jobId: z.cuid2().openapi({ param: { name: "jobId", in: "path" } }),
});

export type JobId = z.infer<typeof JobIdSchema>;

export const CreateJobInputSchema = JobShape.superRefine((data, ctx) => {
  if (data.jobType === JOB_TYPE.ROLE && !data.employmentType) {
    ctx.addIssue({
      path: ["employmentType"],
      code: "custom",
      message: "employmentType is required for ROLE jobs",
    });
  }

  if (data.jobType === JOB_TYPE.GIG && !data.gigType) {
    ctx.addIssue({
      path: ["gigType"],
      code: "custom",
      message: "gigType is required for GIG jobs",
    });
  }
});

export type CreateJobInput = z.infer<typeof CreateJobInputSchema>;

export const UpdateJobInputSchema = CreateJobInputSchema.partial().extend({
  id: z.cuid2(),
  status: z.enum(JOB_STATUS).optional(),
  version: z.int(),
});

export type UpdateJobInput = z.infer<typeof UpdateJobInputSchema>;

export const CreateGigJobInputSchema = GigDetailsSchema.extend({
  id: z.cuid2(),
});

export type CreateGigJobInput = z.infer<typeof CreateGigJobInputSchema>;

export const UpdateGigJobInputSchema = CreateGigJobInputSchema.partial().extend({
  id: z.cuid2(),
  version: z.int().default(1),
});

export type UpdateGigJobInput = z.infer<typeof UpdateGigJobInputSchema>;

export const CreateRoleJobInputSchema = RoleDetailsSchema.extend({
  id: z.cuid2(),
});

export type CreateRoleJobInput = z.infer<typeof CreateRoleJobInputSchema>;

export const UpdateRoleJobInputSchema =
  CreateRoleJobInputSchema.partial().extend({
    id: z.cuid2(),
    version: z.int().default(1),
  });

export type UpdateRoleJobInput = z.infer<typeof UpdateRoleJobInputSchema>;

export const GetJobsInputSchema = z.object({
  q: z.string().optional(),
  jobType: z.enum(JOB_TYPE).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type GetJobsInput = z.infer<typeof GetJobsInputSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const GetJobsOutputSchema = z.object({
  jobs: z.array(NormalizedJobSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type GetJobsOutput = z.infer<typeof GetJobsOutputSchema>;

export const GetCreatedJobsOutputSchema = z.object({
  jobs: z.array(NormalizedJobSchema),
  noOfJobs: z.number(),
  noOfArchivedJobs: z.number(),
  noOfActiveJobs: z.number(),
});

export type GetCreatedJobsOutput = z.infer<typeof GetCreatedJobsOutputSchema>;

export type NormalizedJob = z.infer<typeof NormalizedJobSchema>;

/**
 * --------------------------------
 * SEARCH DOCUMENT
 * --------------------------------
 */

export const JobSearchDocumentSchema = z
  .object({
    id: z.cuid2(),
    title: z.string(),
    isApplied: z.boolean().default(false).optional(),
    brandId: z.cuid2(),
    brandName: z.string(),
    brandImgUrl: z.string().nullable().optional(),
    jobType: z.enum(JOB_TYPE),
    status: z.enum(JOB_STATUS).optional(),
    employmentType: z.enum(EMPLOYMENT_TYPE).nullable().optional(),
    workMode: z.enum(WORK_MODE),
    gigType: z.enum(GIG_TYPE).nullable().optional(),
    location: z.enum(JOB_LOCATIONS),
    overview: z.string(),
    requiredSkills: z.array(z.string()),
    wagesMin: z.number().nullable().optional(),
    wagesMax: z.number().nullable().optional(),
    wagesCurrency: z.enum(WAGES_CURRENCY).nullable().optional(),
    wagesType: z.enum(WAGE_TYPES).nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("JobSearchDocument");

export type JobSearchDocument = z.infer<typeof JobSearchDocumentSchema>;
