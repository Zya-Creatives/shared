import { z } from "@hono/zod-openapi";

import {
  EMPLOYMENT_TYPE,
  EmploymentType,
  EXPERIENCE_LEVELS,
  ExperienceLevel,
  GIG_TYPE,
  GigType,
  JOB_LOCATIONS,
  JOB_SECTIONS,
  JOB_STATUS,
  JOB_TYPE,
  JobLocation,
  JobStatus,
  JobType,
  WAGES_CURRENCY,
  WagesCurrency,
  WAGE_TYPES,
  WageTypes,
  WORK_MODE,
  WorkMode,
} from "../constants";

/**
 * --------------------------------
 * ENUMS
 * --------------------------------
 */

const JobTypeSchema = z.enum(
  Object.values(JOB_TYPE) as [JobType, ...JobType[]],
);

const EmploymentTypeSchema = z.enum(
  Object.values(EMPLOYMENT_TYPE) as [EmploymentType, ...EmploymentType[]],
);

const WorkModeSchema = z.enum(
  Object.values(WORK_MODE) as [WorkMode, ...WorkMode[]],
);

const JobStatusSchema = z.enum(
  Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]],
);

const GigTypeSchema = z.enum(
  Object.values(GIG_TYPE) as [GigType, ...GigType[]],
);

const LocationSchema = z.enum(
  Object.values(JOB_LOCATIONS) as [JobLocation, ...JobLocation[]],
);

const ExperienceLevelSchema = z.enum(
  Object.values(EXPERIENCE_LEVELS) as [ExperienceLevel, ...ExperienceLevel[]],
);

const WageCurrencySchema = z.enum(
  Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]],
);

const WageTypeSchema = z.enum(
  Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]],
);

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const JobShape = z.object({
  title: z.string().min(3).max(255),
  brandId: z.cuid2(),
  jobType: JobTypeSchema,
  employmentType: EmploymentTypeSchema.optional(),
  workMode: WorkModeSchema,
  gigType: GigTypeSchema.optional(),
  location: LocationSchema,
  jobSections: z.array(
    z.enum(Object.values(JOB_SECTIONS) as [string, ...string[]]),
  ),
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

const GigDetailsSchema = z.object({
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

const RoleDetailsSchema = z.object({
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

export const JobWithGigDetailsEntitySchema = JobEntitySchema.extend(
  GigDetailsSchema.shape,
);

export type JobWithGigDetailsEntity = z.infer<
  typeof JobWithGigDetailsEntitySchema
>;

export const JobWithRoleDetailsEntitySchema = JobEntitySchema.extend(
  RoleDetailsSchema.shape,
);

export type JobWithRoleDetailsEntity = z.infer<
  typeof JobWithRoleDetailsEntitySchema
>;

export const NormalizedJobSchema = z.union([
  JobWithGigDetailsEntitySchema,
  JobWithRoleDetailsEntitySchema,
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

export const JobSearchDocumentSchema = z.object({
  id: z.cuid2(),
  title: z.string(),
  brandId: z.cuid2(),
  brandName: z.string(),
  brandImgUrl: z.string().nullable().optional(),
  jobType: z.enum(["GIG", "ROLE"]),
  location: z.string(),
  overview: z.string(),
  requiredSkills: z.array(z.string()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type JobSearchDocument = z.infer<typeof JobSearchDocumentSchema>;
