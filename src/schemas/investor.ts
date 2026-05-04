import { z } from "@hono/zod-openapi";
import {
  EXPERIENCE_LEVELS,
  type ExperienceLevel,
  GEOGRAPHIC_FOCUS,
  type GeographicFocus,
  INVESTMENT_SIZES,
  type InvestmentSize,
  INVESTOR_TYPES,
  type InvestorType,
  LINK_TYPES,
} from "../constants";
import { CuidSchema, ProfileIdentifierSchema } from "./common";
import { MinimalUserSchema } from "./minimal-user";


/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const InvestorShape = z.object({
  bio: z.string().max(600).default(""),
  location: z.string().default(""),

  experienceLevel: z.enum(
    Object.values(EXPERIENCE_LEVELS) as [ExperienceLevel, ...ExperienceLevel[]],
  ),

  investorType: z.enum(
    Object.values(INVESTOR_TYPES) as [InvestorType, ...InvestorType[]],
  ),

  investmentSize: z.enum(
    Object.values(INVESTMENT_SIZES) as [InvestmentSize, ...InvestmentSize[]],
  ),

  geographicFocus: z.enum(
    Object.values(GEOGRAPHIC_FOCUS) as [GeographicFocus, ...GeographicFocus[]],
  ),

  websiteURL: z.url().default(""),

  disciplines: z.array(z.string()).default([]),

  links: z
    .array(
      z.object({
        url: z.url(),
        type: z.enum(LINK_TYPES).default(LINK_TYPES.GENERIC_WEBSITE),
      }),
    )
    .default([]),

  achievements: z
    .array(
      z.object({
        title: z.string(),
        link: z.url().optional(),
        year: z.number().int().optional(),
      }),
    )
    .default([]),
});

export type InvestorShapeType = z.infer<typeof InvestorShape>;

/**
 * --------------------------------
 * ENTITY (DTO)
 * --------------------------------
 */

export const InvestorEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),
    ...InvestorShape.shape,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    version: z.int(),
  })
  .openapi("Investor");

export type InvestorEntity = z.infer<typeof InvestorEntitySchema>;

/**
 * Minimal version = derived, not duplicated
 */

export const MinimalInvestorEntitySchema = InvestorEntitySchema.pick({
  id: true,
  userId: true,
  bio: true,
  location: true,
  experienceLevel: true,
  investorType: true,
  investmentSize: true,
  geographicFocus: true,
  websiteURL: true,
  disciplines: true,
  createdAt: true,
  updatedAt: true,
});

export type MinimalInvestorEntity = z.infer<typeof MinimalInvestorEntitySchema>;

/**
 * --------------------------------
 * INPUT DTOs
 * --------------------------------
 */

export const CreateInvestorProfileInputSchema = InvestorShape.pick({
  experienceLevel: true,
  location: true,
  websiteURL: true,
}).extend({
  disciplineSlugs: z.array(z.string()).min(1),
});

export type CreateInvestorInput = z.infer<
  typeof CreateInvestorProfileInputSchema
>;

export const UpdateInvestorProfileInputSchema = InvestorShape.partial()
  .extend({
    disciplineSlugs: z.array(z.string()).optional(),
    version: z.int(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type UpdateInvestorInput = z.infer<
  typeof UpdateInvestorProfileInputSchema
>;

/**
 * --------------------------------
 * GET / SEARCH
 * --------------------------------
 */

export const GetInvestorParamsSchema = z.object({
  value: CuidSchema,
});

export const GetInvestorQuerySchema = ProfileIdentifierSchema;

/**
 * --------------------------------
 * OUTPUT
 * --------------------------------
 */

export const CreateInvestorOutputSchema = InvestorEntitySchema;
export const GetInvestorOutputSchema = InvestorEntitySchema;
export const UpdateInvestorOutputSchema = InvestorEntitySchema;

export type CreateInvestorOutput = z.infer<typeof CreateInvestorOutputSchema>;
export type GetInvestorOutput = z.infer<typeof GetInvestorOutputSchema>;
export type UpdateInvestorOutput = z.infer<typeof UpdateInvestorOutputSchema>;

/**
 * --------------------------------
 * ENTITY WITH USER
 * --------------------------------
 */

export const InvestorWithUserEntitySchema = MinimalInvestorEntitySchema.extend({
  user: MinimalUserSchema,
});

export type InvestorWithUserEntity = z.infer<
  typeof InvestorWithUserEntitySchema
>;

/**
 * --------------------------------
 * LIST / SEARCH
 * --------------------------------
 */

export const ListInvestorsInputSchema = z.object({
  query: z.string().default(""),
  disciplines: z.array(z.string()).optional(),
  experienceLevels: z
    .array(
      z.enum(
        Object.values(EXPERIENCE_LEVELS) as [
          ExperienceLevel,
          ...ExperienceLevel[],
        ],
      ),
    )
    .optional(),

  location: z.string().optional(),
  tags: z.array(z.string()).optional(),

  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListInvestorsInput = z.infer<typeof ListInvestorsInputSchema>;

export const SearchInvestorInputSchema = z.object({
  string: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type SearchInvestorInput = z.infer<typeof SearchInvestorInputSchema>;

export const SearchInvestorOutputSchema = z.object({
  investors: z.array(InvestorWithUserEntitySchema),
  nextCursor: z.string().nullable().optional(),
});

export type SearchInvestorOutput = z.infer<typeof SearchInvestorOutputSchema>;
