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

export const MinimalJobEntitySchema = z.object({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000job1" }),
  title: z.string().openapi({ example: "Senior Frontend Engineer" }),
  brandId: z.cuid2().openapi({ example: "ckj1a2b3c0000brnd" }),
  jobType: z
    .enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]])
    .openapi({ example: "ROLE" }),
});

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
  createdAt: z.date().openapi({ example: "2026-03-11T09:00:00.000Z" }),
  version: z.int().openapi({ example: 1 }),
  updatedAt: z.date().openapi({ example: "2026-03-11T09:00:00.000Z" }),
});

export const JobIdSchema = z.object({
  jobId: z.cuid2().openapi({ example: "ckj1a2b3c0000job1" }),
});

export const JobEntitySchema = z.object({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000job1" }),
  title: z.string().openapi({ example: "Senior Frontend Engineer" }),
  brandId: z.cuid2().openapi({ example: "ckj1a2b3c0000brnd" }),
  brandName: z.string().openapi({ example: "Acme Corp" }),
  brandImgUrl: z
    .string()
    .url()
    .optional()
    .openapi({ example: "https://example.com/logo.png" }),
  jobType: z
    .enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]])
    .openapi({ example: "ROLE" }),
  status: z
    .enum(Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]])
    .openapi({ example: "OPEN" }),
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
    .openapi({ example: "LAGOS" }),
  jobSections: z
    .array(JobSectionEnum)
    .default([
      JOB_SECTIONS.PERSONAL_INFORMATION,
      JOB_SECTIONS.PROFESSIONAL_INFORMATION,
      JOB_SECTIONS.RESUME,
      JOB_SECTIONS.COVER_LETTER,
    ])
    .openapi({ example: ["PERSONAL_INFORMATION", "RESUME"] }),
  isBookmarked: z.boolean().openapi({ example: false }),
  createdAt: z.date().openapi({ example: "2026-03-11T09:00:00.000Z" }),
  version: z.int().openapi({ example: 1 }),
  updatedAt: z.date().openapi({ example: "2026-03-11T09:00:00.000Z" }),
});

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
  wagesMin: z.number().optional().openapi({ example: 500 }),
  wagesMax: z.number().optional().openapi({ example: 1000 }),
  wagesCurrency: z
    .enum(Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]])
    .optional()
    .openapi({ example: "USD" }),
  wagesType: z
    .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
    .optional()
    .openapi({ example: "FIXED" }),
});

export const JobWithGigDetailsEntitySchema = JobEntitySchema.extend(
  GigJobEntitySchema.shape,
);

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

export const JobWithRoleDetailsEntitySchema = JobEntitySchema.extend(
  RoleJobEntitySchema.shape,
);

const CreateJobInputBaseSchema = z.object({
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
  if (data.jobType === JOB_TYPE.ROLE) {
    return { ...data, gigType: undefined };
  }

  if (data.jobType === JOB_TYPE.GIG) {
    return { ...data, employmentType: undefined };
  }

  return data;
});

export const CreateRoleJobInputSchema = z
  .object({
    id: z.cuid2().openapi({ example: "ckj1a2b3c0000rol1" }),
    experienceLevel: z
      .enum(
        Object.values(EXPERIENCE_LEVELS) as [
          ExperienceLevel,
          ...ExperienceLevel[],
        ],
      )
      .openapi({ example: "MID_LEVEL" }),
    overview: z
      .string()
      .openapi({ example: "Build cool features for our app." }),
    keyResponsibilities: z
      .string()
      .openapi({ example: "Write code, review PRs." }),
    requiredSkills: z
      .array(z.string())
      .openapi({ example: ["JavaScript", "React"] }),
    employeeRequirements: z
      .string()
      .optional()
      .openapi({ example: "Good communication skills." }),
    companyBenefits: z
      .string()
      .optional()
      .openapi({ example: "Unlimited PTO." }),
    wagesMin: z.number().optional().nullable().openapi({ example: 60000 }),
    wagesMax: z.number().optional().nullable().openapi({ example: 90000 }),
    wagesCurrency: z
      .enum(
        Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]],
      )
      .optional()
      .openapi({ example: "USD" }),
    wagesType: z
      .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
      .optional()
      .openapi({ example: "YEARLY" }),
  })
  .refine(
    ({ wagesMin, wagesMax }) =>
      wagesMin == null || wagesMax == null || wagesMax > wagesMin,
    {
      message: "wagesMax must be greater than wagesMin",
      path: ["wagesMax"],
    },
  );

export const CreateGigJobInputSchema = z
  .object({
    id: z.cuid2().openapi({ example: "ckj1a2b3c0000gig1" }),
    overview: z
      .string()
      .openapi({ example: "Need a logo designed for a new brand." }),
    deliverables: z
      .string()
      .openapi({ example: "Vector files, PNGs, and a brand guide." }),
    employeeRequirements: z
      .string()
      .optional()
      .openapi({ example: "Portfolio required." }),
    aboutCompany: z
      .string()
      .optional()
      .openapi({ example: "E-commerce store." }),
    requiredSkills: z
      .array(z.string())
      .openapi({ example: ["Graphic Design", "Illustrator"] }),
    wagesMin: z.number().optional().nullable().openapi({ example: 100 }),
    wagesMax: z.number().optional().nullable().openapi({ example: 500 }),
    wagesCurrency: z
      .enum(
        Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]],
      )
      .optional()
      .openapi({ example: "USD" }),
    wagesType: z
      .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
      .optional()
      .openapi({ example: "FIXED" }),
  })
  .refine(
    ({ wagesMin, wagesMax }) =>
      wagesMin == null || wagesMax == null || wagesMax > wagesMin,
    {
      message: "wagesMax must be greater than wagesMin",
      path: ["wagesMax"],
    },
  );

export const UpdateRoleJobInputSchema = CreateRoleJobInputSchema.partial()
  .extend({ version: z.int().openapi({ example: 2 }) })
  .required({ id: true });

export const UpdateGigJobInputSchema = CreateGigJobInputSchema.partial()
  .extend({ version: z.int().openapi({ example: 2 }) })
  .required({ id: true });

export const UpdateJobInputSchema = CreateJobInputBaseSchema.partial().extend({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000job1" }),
  status: z
    .enum(Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]])
    .optional()
    .openapi({ example: "CLOSED" }),
  version: z.int().openapi({ example: 2 }),
});

export const NormalizedJobSchema = z.union([
  JobWithGigDetailsEntitySchema,
  JobEntitySchema,
  JobWithRoleDetailsEntitySchema,
]);

export const GetCreatedJobsOutputSchema = z.object({
  jobs: z.array(NormalizedJobSchema).openapi({ example: [] }),
  noOfJobs: z.number().openapi({ example: 45 }),
  noOfActiveJobs: z.number().openapi({ example: 12 }),
  noOfArchivedJobs: z.number().openapi({ example: 33 }),
});

export const GetJobsInputSchema = z.object({
  q: z.string().optional().openapi({ example: "frontend engineer" }),
  jobType: z
    .enum(Object.values(JOB_TYPE) as [string, ...string[]])
    .optional()
    .openapi({ example: "ROLE" }),
  workMode: z
    .string()
    .optional()
    .describe("Comma-separated values, e.g. 'Remote,Hybrid'")
    .openapi({ example: "Remote,Hybrid" }),
  location: z
    .enum(Object.values(JOB_LOCATIONS) as [string, ...string[]])
    .optional()
    .openapi({ example: "LAGOS" }),
  employmentType: z
    .string()
    .optional()
    .describe("Comma-separated values, e.g. 'Full Time,Freelance'")
    .openapi({ example: "Full Time,Freelance" }),
  gigType: z
    .enum(Object.values(GIG_TYPE) as [string, ...string[]])
    .optional()
    .openapi({ example: "PROJECT_BASED" }),
  requiredSkills: z
    .string()
    .optional()
    .describe("Comma-separated skills")
    .openapi({ example: "React,TypeScript" }),
  status: z.string().optional().openapi({ example: "OPEN" }),
  page: z.coerce.number().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().min(1).max(100).default(20).openapi({ example: 20 }),
});

export const GetJobsOutputSchema = z.object({
  jobs: z.array(NormalizedJobSchema).openapi({ example: [] }),
  total: z.number().openapi({ example: 150 }),
  page: z.number().openapi({ example: 1 }),
  limit: z.number().openapi({ example: 20 }),
  totalPages: z.number().openapi({ example: 8 }),
  hasNextPage: z.boolean().openapi({ example: true }),
  hasPrevPage: z.boolean().openapi({ example: false }),
});



export const JobSearchDocumentSchema = z.object({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000doc" }),
  title: z.string().openapi({ example: "Senior Frontend Engineer" }),
  brandId: z.cuid2().openapi({ example: "ckj1a2b3c0000brnd" }),
  brandName: z.string().openapi({ example: "Acme Corp" }),
  brandImgUrl: z.string().nullable().optional().openapi({ example: "https://example.com/logo.png" }),
  jobType: z.enum(["GIG", "ROLE"]).openapi({ example: "ROLE" }),
  status: z.string().optional().openapi({ example: "OPEN" }),
  employmentType: z.string().nullable().optional().openapi({ example: "FULL_TIME" }),
  workMode: z.string().openapi({ example: "REMOTE" }),
  gigType: z.string().nullable().optional().openapi({ example: "PROJECT_BASED" }),
  location: z.string().openapi({ example: "LAGOS" }),
  overview: z.string().openapi({ example: "Looking for a seasoned engineer to lead our product development." }),
  requiredSkills: z.array(z.string()).openapi({ example: ["React", "TypeScript", "Next.js"] }),
  wagesMin: z.number().nullable().optional().openapi({ example: 80000 }),
  wagesMax: z.number().nullable().optional().openapi({ example: 120000 }),
  wagesCurrency: z.string().nullable().optional().openapi({ example: "USD" }),
  wagesType: z.string().nullable().optional().openapi({ example: "YEARLY" }),
  createdAt: z.string().openapi({ example: "2026-03-11T09:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-03-11T09:00:00.000Z" }),
}).openapi({
  title: "Job Search Document",
  description: "Flattened schema used for indexing jobs in search engines.",
});
