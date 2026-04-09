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

const JobSectionEnum = z
  .enum(Object.values(JOB_SECTIONS) as [string, ...string[]])
  .openapi({ example: "PROFESSIONAL_INFORMATION" });

export const JobIdSchema = z.object({
  jobId: z.cuid2().openapi({ example: "ckj1a2b3c0000job1" }),
});

export type JobIdInput = z.infer<typeof JobIdSchema>;

export const BaseJobEntitySchema = z.object({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000job1" }),
  title: z.string().openapi({ example: "Senior Frontend Engineer" }),
  brandId: z.cuid2().openapi({ example: "ckj1a2b3c0000brnd" }),
  jobType: z
    .enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]])
    .openapi({ example: "ROLE" }),
  employmentType: z
    .enum(
      Object.values(EMPLOYMENT_TYPE) as [EmploymentType, ...EmploymentType[]],
    )
    .optional()
    .openapi({ example: "FULL_TIME" }),
  workMode: z
    .enum(Object.values(WORK_MODE) as [WorkMode, ...WorkMode[]])
    .openapi({ example: "REMOTE" }),
  status: z
    .enum(Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]])
    .openapi({ example: "OPEN" }),
  gigType: z
    .enum(Object.values(GIG_TYPE) as [GigType, ...GigType[]])
    .optional()
    .openapi({ example: "PROJECT_BASED" }),
  location: z
    .enum(Object.values(JOB_LOCATIONS) as [JobLocation, ...JobLocation[]])
    .openapi({ example: "LAGOS" }),
  jobSections: z
    .array(JobSectionEnum)
    .default([
      JOB_SECTIONS.PERSONAL_INFORMATION,
      JOB_SECTIONS.PROFESSIONAL_INFORMATION,
      JOB_SECTIONS.RESUME,
      JOB_SECTIONS.COVER_LETTER,
    ])
    .openapi({
      example: [
        "PERSONAL_INFORMATION",
        "PROFESSIONAL_INFORMATION",
        "RESUME",
        "COVER_LETTER",
      ],
    }),
  createdAt: z.date().openapi({ example: "2026-04-09T12:00:00.000Z" }),
  version: z.number().int().openapi({ example: 1 }),
  updatedAt: z.date().openapi({ example: "2026-04-09T12:00:00.000Z" }),
});

export type BaseJobEntity = z.infer<typeof BaseJobEntitySchema>;

export const JobEntitySchema = BaseJobEntitySchema.extend({
  brandName: z.string().openapi({ example: "Acme Corp" }),
  isApplied: z.boolean().default(false).optional(),
  brandImgUrl: z
    .url()
    .optional()
    .openapi({ example: "https://example.com/logo.png" }),
  isBookmarked: z.boolean().openapi({ example: false }),
});

export type JobEntity = z.infer<typeof JobEntitySchema>;

export const GigJobEntitySchema = z.object({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000gig1" }),
  jobType: z.literal(JOB_TYPE.GIG).openapi({ example: "GIG" }),
  overview: z
    .string()
    .openapi({ example: "We need a landing page redesigned." }),
  deliverables: z
    .string()
    .openapi({ example: "Figma files and exported assets." }),
  employeeRequirements: z
    .string()
    .optional()
    .openapi({ example: "Must have 3+ years in UI/UX." }),
  aboutCompany: z
    .string()
    .optional()
    .openapi({ example: "A fast-growing fintech startup." }),
  requiredSkills: z
    .array(z.string())
    .openapi({ example: ["Figma", "UI Design"] }),
  wagesMin: z.number().optional().nullable().openapi({ example: 500 }),
  wagesMax: z.number().optional().nullable().openapi({ example: 1000 }),
  wagesCurrency: z
    .enum(Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]])
    .optional()
    .openapi({ example: "USD" }),
  wagesType: z
    .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
    .optional()
    .openapi({ example: "FIXED" }),
});

export type GigJobEntity = z.infer<typeof GigJobEntitySchema>;

export const JobWithGigDetailsEntitySchema = JobEntitySchema.extend(
  GigJobEntitySchema.omit({ id: true, jobType: true }).shape,
);

export type JobWithGigDetailsEntity = z.infer<
  typeof JobWithGigDetailsEntitySchema
>;

export const RoleJobEntitySchema = z.object({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000rol1" }),
  jobType: z.literal(JOB_TYPE.ROLE).openapi({ example: "ROLE" }),
  experienceLevel: z
    .enum(
      Object.values(EXPERIENCE_LEVELS) as [
        ExperienceLevel,
        ...ExperienceLevel[],
      ],
    )
    .openapi({ example: "SENIOR" }),
  overview: z
    .string()
    .openapi({ example: "Lead the development of our core product." }),
  keyResponsibilities: z
    .string()
    .openapi({ example: "Architect systems, mentor juniors." }),
  requiredSkills: z
    .array(z.string())
    .openapi({ example: ["React", "TypeScript", "Node.js"] }),
  employeeRequirements: z
    .string()
    .optional()
    .openapi({ example: "BS in Computer Science." }),
  companyBenefits: z
    .string()
    .optional()
    .openapi({ example: "Health insurance, remote work." }),
  wagesMin: z.number().optional().nullable().openapi({ example: 80000 }),
  wagesMax: z.number().optional().nullable().openapi({ example: 120000 }),
  wagesCurrency: z
    .enum(Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]])
    .optional()
    .openapi({ example: "USD" }),
  wagesType: z
    .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
    .optional()
    .openapi({ example: "YEARLY" }),
});

export type RoleJobEntity = z.infer<typeof RoleJobEntitySchema>;

export const JobWithRoleDetailsEntitySchema = JobEntitySchema.extend(
  RoleJobEntitySchema.omit({ id: true, jobType: true }).shape,
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

const CreateJobInputBaseSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(255)
    .openapi({ example: "Senior Frontend Engineer" }),
  brandId: z.cuid2().openapi({ example: "ckj1a2b3c0000brnd" }),
  jobType: z
    .enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]])
    .openapi({ example: "ROLE" }),
  employmentType: z
    .enum(
      Object.values(EMPLOYMENT_TYPE) as [EmploymentType, ...EmploymentType[]],
    )
    .optional()
    .openapi({ example: "FULL_TIME" }),
  workMode: z
    .enum(Object.values(WORK_MODE) as [WorkMode, ...WorkMode[]])
    .openapi({ example: "REMOTE" }),
  gigType: z
    .enum(Object.values(GIG_TYPE) as [GigType, ...GigType[]])
    .optional()
    .openapi({ example: "PROJECT_BASED" }),
  location: z
    .enum(Object.values(JOB_LOCATIONS) as [JobLocation, ...JobLocation[]])
    .default(JOB_LOCATIONS.REMOTE)
    .openapi({ example: "REMOTE" }),
  jobSections: z
    .array(JobSectionEnum)
    .min(1, { message: "At least one job section must be provided." })
    .openapi({ example: ["PERSONAL_INFORMATION", "RESUME"] }),
});

export const CreateJobInputSchema = CreateJobInputBaseSchema.superRefine(
  (data, ctx) => {
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
  },
).transform((data) => {
  if (data.jobType === JOB_TYPE.ROLE) return { ...data, gigType: undefined };
  if (data.jobType === JOB_TYPE.GIG)
    return { ...data, employmentType: undefined };
  return data;
});

export type CreateJobInput = z.infer<typeof CreateJobInputSchema>;

export const CreateRoleJobInputSchema = RoleJobEntitySchema.omit({
  id: true,
  jobType: true,
})
  .extend({ id: z.cuid2() })
  .refine(
    ({ wagesMin, wagesMax }) =>
      wagesMin == null || wagesMax == null || wagesMax > wagesMin,
    {
      message: "wagesMax must be greater than wagesMin",
      path: ["wagesMax"],
    },
  );

export type CreateRoleJobInput = z.infer<typeof CreateRoleJobInputSchema>;

export const CreateGigJobInputSchema = GigJobEntitySchema.omit({
  id: true,
  jobType: true,
})
  .extend({ id: z.cuid2() })
  .refine(
    ({ wagesMin, wagesMax }) =>
      wagesMin == null || wagesMax == null || wagesMax > wagesMin,
    {
      message: "wagesMax must be greater than wagesMin",
      path: ["wagesMax"],
    },
  );

export type CreateGigJobInput = z.infer<typeof CreateGigJobInputSchema>;

export const UpdateJobInputSchema = CreateJobInputBaseSchema.partial().extend({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000job1" }),
  status: z
    .enum(Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]])
    .optional(),
  version: z.number().int().openapi({ example: 2 }),
});

export type UpdateJobInput = z.infer<typeof UpdateJobInputSchema>;

export const GetJobsInputSchema = z.object({
  q: z.string().optional().openapi({ example: "frontend engineer" }),
  jobType: z.enum(Object.values(JOB_TYPE) as [string, ...string[]]).optional(),
  workMode: z.string().optional().describe("Comma-separated values"),
  location: z
    .enum(Object.values(JOB_LOCATIONS) as [string, ...string[]])
    .optional(),
  employmentType: z.string().optional().describe("Comma-separated values"),
  gigType: z.enum(Object.values(GIG_TYPE) as [string, ...string[]]).optional(),
  requiredSkills: z.string().optional().describe("Comma-separated skills"),
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type GetJobsInput = z.infer<typeof GetJobsInputSchema>;

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
  noOfActiveJobs: z.number(),
  noOfArchivedJobs: z.number(),
});

export type GetCreatedJobsOutput = z.infer<typeof GetCreatedJobsOutputSchema>;

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
