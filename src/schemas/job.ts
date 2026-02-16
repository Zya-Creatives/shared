import { z } from "zod";
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
  WAGE_TYPES,
  WAGES_CURRENCY,
  WagesCurrency,
  WageTypes,
  WORK_MODE,
  WorkMode,
} from "../constants";

const JobSectionEnum = z.enum(
  Object.values(JOB_SECTIONS) as [string, ...string[]],
);

export const MinimalJobEntitySchema = z.object({
  id: z.cuid2(),
  title: z.string(),
  brandId: z.cuid2(),
  jobType: z.enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]]),
});

export const BaseJobEntitySchema = z.object({
  id: z.cuid2(),
  title: z.string(),
  brandId: z.cuid2(),
  jobType: z.enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]]),
  employmentType: z
    .enum(
      Object.values(EMPLOYMENT_TYPE) as [EmploymentType, ...EmploymentType[]],
    )
    .optional(),
  workMode: z.enum(Object.values(WORK_MODE) as [WorkMode, ...WorkMode[]]),
  status: z.enum(Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]]),
  gigType: z
    .enum(Object.values(GIG_TYPE) as [GigType, ...GigType[]])
    .optional(),
  location: z.enum(
    Object.values(JOB_LOCATIONS) as [JobLocation, ...JobLocation[]],
  ),
  jobSections: z
    .array(JobSectionEnum)
    .default([
      JOB_SECTIONS.PERSONAL_INFORMATION,
      JOB_SECTIONS.PROFESSIONAL_INFORMATION,
      JOB_SECTIONS.RESUME,
      JOB_SECTIONS.COVER_LETTER,
    ]),
  createdAt: z.date(),
  version: z.int(),
  updatedAt: z.date(),
});

export const JobIdSchema = z.object({
  jobId: z.cuid2(),
});

export const JobEntitySchema = z.object({
  id: z.cuid2(),
  title: z.string(),
  brandId: z.cuid2(),
  brandName: z.cuid2(),
  brandImgUrl: z.cuid2().optional(),
  jobType: z.enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]]),
  status: z.enum(Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]]),
  employmentType: z
    .enum(
      Object.values(EMPLOYMENT_TYPE) as [EmploymentType, ...EmploymentType[]],
    )
    .optional(),
  workMode: z.enum(Object.values(WORK_MODE) as [WorkMode, ...WorkMode[]]),
  gigType: z
    .enum(Object.values(GIG_TYPE) as [GigType, ...GigType[]])
    .optional(),
  location: z.enum(
    Object.values(JOB_LOCATIONS) as [JobLocation, ...JobLocation[]],
  ),
  jobSections: z
    .array(JobSectionEnum)
    .default([
      JOB_SECTIONS.PERSONAL_INFORMATION,
      JOB_SECTIONS.PROFESSIONAL_INFORMATION,
      JOB_SECTIONS.RESUME,
      JOB_SECTIONS.COVER_LETTER,
    ]),
  isBookmarked: z.boolean(),
  createdAt: z.date(),
  version: z.int(),
  updatedAt: z.date(),
});

export const GigJobEntitySchema = z.object({
  id: z.cuid2(),
  jobType: z.literal(JOB_TYPE.GIG),
  overview: z.string(),
  deliverables: z.string(),
  employeeRequirements: z.string().optional(),
  aboutCompany: z.string().optional(),
  requiredSkills: z.array(z.string()),
  wagesMin: z.number().optional(),
  wagesMax: z.number().optional(),
  wagesCurrency: z
    .enum(Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]])
    .optional(),
  wagesType: z
    .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
    .optional(),
});

export const JobWithGigDetailsEntitySchema = JobEntitySchema.extend(
  GigJobEntitySchema.shape,
);

export const RoleJobEntitySchema = z.object({
  id: z.cuid2(),
  jobType: z.literal(JOB_TYPE.ROLE),
  experienceLevel: z.enum(
    Object.values(EXPERIENCE_LEVELS) as [ExperienceLevel, ...ExperienceLevel[]],
  ),
  overview: z.string(),
  keyResponsibilities: z.string(),
  requiredSkills: z.array(z.string()),
  employeeRequirements: z.string().optional(),
  companyBenefits: z.string().optional(),
  wagesMin: z.number().optional(),
  wagesMax: z.number().optional(),
  wagesCurrency: z
    .enum(Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]])
    .optional(),
  wagesType: z
    .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
    .optional(),
});

export const JobWithRoleDetailsEntitySchema = JobEntitySchema.extend(
  RoleJobEntitySchema.shape,
);

const CreateJobInputBaseSchema = z.object({
  title: z.string(),
  brandId: z.cuid2(),
  jobType: z.enum(Object.values(JOB_TYPE) as [JobType, ...JobType[]]),

  employmentType: z
    .enum(
      Object.values(EMPLOYMENT_TYPE) as [EmploymentType, ...EmploymentType[]],
    )
    .optional(),

  workMode: z.enum(Object.values(WORK_MODE) as [WorkMode, ...WorkMode[]]),

  gigType: z
    .enum(Object.values(GIG_TYPE) as [GigType, ...GigType[]])
    .optional(),

  location: z
    .enum(Object.values(JOB_LOCATIONS) as [JobLocation, ...JobLocation[]])
    .default(JOB_LOCATIONS.REMOTE),

  jobSections: z
    .array(JobSectionEnum)
    .min(1, { message: "At least one job section must be provided." }),
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
    id: z.cuid2(),
    experienceLevel: z.enum(
      Object.values(EXPERIENCE_LEVELS) as [
        ExperienceLevel,
        ...ExperienceLevel[],
      ],
    ),
    overview: z.string(),
    keyResponsibilities: z.string(),
    requiredSkills: z.array(z.string()),
    employeeRequirements: z.string().optional(),
    companyBenefits: z.string().optional(),
    wagesMin: z.number().optional(),
    wagesMax: z.number().optional(),
    wagesCurrency: z
      .enum(
        Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]],
      )
      .optional(),
    wagesType: z
      .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
      .optional(),
  })
  .refine(
    ({ wagesMin, wagesMax }) =>
      wagesMin === undefined || wagesMax === undefined || wagesMax > wagesMin,
    {
      message: "wagesMax must be greater than wagesMin",
      path: ["wagesMax"],
    },
  );

export const CreateGigJobInputSchema = z
  .object({
    id: z.cuid2(),
    overview: z.string(),
    deliverables: z.string(),
    employeeRequirements: z.string().optional(),
    aboutCompany: z.string().optional(),
    requiredSkills: z.array(z.string()),
    wagesMin: z.number().optional(),
    wagesMax: z.number().optional(),
    wagesCurrency: z
      .enum(
        Object.values(WAGES_CURRENCY) as [WagesCurrency, ...WagesCurrency[]],
      )
      .optional(),
    wagesType: z
      .enum(Object.values(WAGE_TYPES) as [WageTypes, ...WageTypes[]])
      .optional(),
  })
  .refine(
    ({ wagesMin, wagesMax }) =>
      wagesMin === undefined || wagesMax === undefined || wagesMax > wagesMin,
    {
      message: "wagesMax must be greater than wagesMin",
      path: ["wagesMax"],
    },
  );

export const UpdateRoleJobInputSchema = CreateRoleJobInputSchema.partial()
  .extend({ version: z.int() })
  .required({ id: true });

export const UpdateGigJobInputSchema = CreateGigJobInputSchema.partial()
  .extend({ version: z.int() })
  .required({ id: true });

export const UpdateJobInputSchema = CreateJobInputBaseSchema.partial().extend({
  id: z.cuid2(),
  status: z
    .enum(Object.values(JOB_STATUS) as [JobStatus, ...JobStatus[]])
    .optional(),
  version: z.int(),
});

export const NormalizedJobSchema = z.union([
  JobWithGigDetailsEntitySchema,
  JobEntitySchema,
  JobWithRoleDetailsEntitySchema,
]);

export const GetCreatedJobsOutputSchema = z.object({
  jobs: z.array(NormalizedJobSchema),
  noOfJobs: z.number(),
  noOfActiveJobs: z.number(),
  noOfArchivedJobs: z.number(),
});

export const GetJobsInputSchema = z.object({
  q: z.string().optional(),
  jobType: z.enum(Object.values(JOB_TYPE) as [string, ...string[]]).optional(),
  workMode: z
    .string()
    .optional()
    .describe("Comma-separated values, e.g. 'Remote,Hybrid'"),
  location: z
    .enum(Object.values(JOB_LOCATIONS) as [string, ...string[]])
    .optional(),
  employmentType: z
    .string()
    .optional()
    .describe("Comma-separated values, e.g. 'Full Time,Freelance'"),
  gigType: z.enum(Object.values(GIG_TYPE) as [string, ...string[]]).optional(),
  requiredSkills: z.string().optional().describe("Comma-separated skills"),
  status: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const GetJobsOutputSchema = z.object({
  jobs: z.array(NormalizedJobSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});
