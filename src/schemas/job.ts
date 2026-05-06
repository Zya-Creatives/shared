import { z } from "@hono/zod-openapi";

import {
  EMPLOYMENT_TYPE,
  type EmploymentType,
  EXPERIENCE_LEVELS,
  type ExperienceLevel,
  GIG_TYPE,
  type GigType,
  JOB_LOCATIONS,
  JOB_SECTIONS,
  JOB_STATUS,
  type JobStatus,
  JOB_TYPE,
  type JobType,
  WAGES_CURRENCY,
  type WagesCurrency,
  WAGE_TYPES,
  type WageTypes,
  WORK_MODE,
  type WorkMode,
  JobLocation,
} from "../constants";

/**
 * --------------------------------
 * ENUMS
 * --------------------------------
 */

export const JobTypeSchema = z.enum(
  Object.values(JOB_TYPE) as [JobType, ...JobType[]],
);

export const EmploymentTypeSchema = z.enum(
  Object.values(EMPLOYMENT_TYPE) as [EmploymentType, ...EmploymentType[]],
);

export const WorkModeSchema = z.enum(
  Object.values(WORK_MODE) as [WorkMode, ...WorkMode[]],
);

export const JobStatusSchema = z.enum(
  Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]],
);

export const GigTypeSchema = z.enum(
  Object.values(GIG_TYPE) as [GigType, ...GigType[]],
);

export const JobLocationSchema = z.enum(
  Object.values(JOB_LOCATIONS) as [JobLocation, ...JobLocation[]],
);

export const ExperienceLevelSchema = z.enum(
  Object.values(EXPERIENCE_LEVELS) as [ExperienceLevel, ...ExperienceLevel[]],
);

export const WageCurrencySchema = z.enum(
  Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]],
);

export const WageTypeSchema = z.enum(
  Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]],
);

export const JobSectionSchema = z.enum(
  Object.values(JOB_SECTIONS) as [string, ...string[]],
);

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

export const JobShape = z.object({
  title: z.string().min(3).max(255),
  brandId: z.cuid2(),
  jobType: JobTypeSchema,
  employmentType: EmploymentTypeSchema.optional(),
  workMode: WorkModeSchema,
  gigType: GigTypeSchema.optional(),
  location: JobLocationSchema,
  jobSections: z.array(JobSectionSchema),
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

    status: JobStatusSchema,

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
  wagesCurrency: WageCurrencySchema.optional(),
  wagesType: WageTypeSchema.optional(),
});

export const RoleDetailsSchema = z.object({
  experienceLevel: ExperienceLevelSchema,
  overview: z.string(),
  keyResponsibilities: z.string(),
  requiredSkills: z.array(z.string()),
  employeeRequirements: z.string().optional(),
  companyBenefits: z.string().optional(),
  wagesMin: z.number().nullable().optional(),
  wagesMax: z.number().nullable().optional(),
  wagesCurrency: WageCurrencySchema.optional(),
  wagesType: WageTypeSchema.optional(),
});

/**
 * --------------------------------
 * DETAILED ENTITIES
 * --------------------------------
 */


export const GigJobEntitySchema = JobEntitySchema.extend({
  jobType: z.literal(JOB_TYPE.GIG),
  gigType: GigTypeSchema,
  employmentType: EmploymentTypeSchema.optional(),
  ...GigDetailsSchema.shape,
}).openapi("GigJob");

export type GigJobEntity = z.infer<typeof GigJobEntitySchema>;

export const RoleJobEntitySchema = JobEntitySchema.extend({
  jobType: z.literal(JOB_TYPE.ROLE),
  employmentType: EmploymentTypeSchema,
  gigType: GigTypeSchema.optional(),
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
 *
 * Do not use discriminatedUnion here because JobEntitySchema has jobType as
 * "GIG" | "ROLE", while GigJobEntitySchema and RoleJobEntitySchema use
 * literals. That makes the discriminator ambiguous.
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
  status: JobStatusSchema.optional(),
  version: z.int(),
});

export type UpdateJobInput = z.infer<typeof UpdateJobInputSchema>;

export const GetJobsInputSchema = z.object({
  q: z.string().optional(),
  jobType: JobTypeSchema.optional(),
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
    jobType: z.enum(["GIG", "ROLE"]),
    status: z.string().optional(),
    employmentType: z.string().nullable().optional(),
    workMode: z.string(),
    gigType: z.string().nullable().optional(),
    location: z.string(),
    overview: z.string(),
    requiredSkills: z.array(z.string()),
    wagesMin: z.number().nullable().optional(),
    wagesMax: z.number().nullable().optional(),
    wagesCurrency: z.string().nullable().optional(),
    wagesType: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("JobSearchDocument");

export type JobSearchDocument = z.infer<typeof JobSearchDocumentSchema>;

export const JobIdSchema = z.object({
  jobId: z.cuid2().openapi({ param: { name: "jobId", in: "path" } }),
});

export type JobId = z.infer<typeof JobIdSchema>;

export const BaseJobEntitySchema = JobEntitySchema;
export type BaseJobEntity = z.infer<typeof BaseJobEntitySchema>;

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

export const UpdateRoleJobInputSchema = CreateRoleJobInputSchema.partial().extend({
  id: z.cuid2(),
  version: z.int().default(1),
});

export type UpdateRoleJobInput = z.infer<typeof UpdateRoleJobInputSchema>;

export const GetCreatedJobsOutputSchema = z.object({
  jobs: z.array(NormalizedJobSchema),
  noOfJobs: z.number(),
  noOfArchivedJobs: z.number(),
  noOfActiveJobs: z.number(),
});

export type GetCreatedJobsOutput = z.infer<typeof GetCreatedJobsOutputSchema>;