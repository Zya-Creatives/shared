import { z } from "@hono/zod-openapi";
import {
  EXPERIENCE_LEVELS,
  ExperienceLevel,
  GEOGRAPHIC_FOCUS,
  GeographicFocus,
  INVESTMENT_SIZES,
  InvestmentSize,
  INVESTOR_TYPES,
  InvestorType,
} from "../constants";
import { CuidSchema, ProfileIdentifierSchema } from "./common";

export const InvestorEntitySchema = z
  .object({
    id: z.cuid2().openapi({ example: "inv_cksd0v6q0000s9a5y8z7p3x9" }),
    userId: z.cuid2().openapi({ example: "user_owner_123" }),
    bio: z
      .string()
      .optional()
      .openapi({ example: "Early stage VC focusing on creative technology." }),
    location: z.string().optional().openapi({ example: "New York, USA" }),
    experienceLevel: z
      .enum(
        Object.values(EXPERIENCE_LEVELS) as [
          ExperienceLevel,
          ...ExperienceLevel[],
        ],
      )
      .optional()
      .openapi({ example: "EXPERT" }),
    geographicFocus: z
      .enum(
        Object.values(GEOGRAPHIC_FOCUS) as [
          GeographicFocus,
          ...GeographicFocus[],
        ],
      )
      .optional()
      .openapi({ example: "NORTH_AMERICA" }),
    investmentSize: z
      .enum(
        Object.values(INVESTMENT_SIZES) as [
          InvestmentSize,
          ...InvestmentSize[],
        ],
      )
      .optional()
      .openapi({ example: "SEED" }),
    investorType: z
      .enum(Object.values(INVESTOR_TYPES) as [InvestorType, ...InvestorType[]])
      .optional()
      .openapi({ example: "VC" }),
    websiteURL: z
      .url()
      .optional()
      .openapi({ example: "https://investorpartners.com" }),
    disciplines: z
      .array(z.string())
      .optional()
      .openapi({ example: ["Product Design", "AI Strategy"] }),
    createdAt: z.coerce
      .date()
      .optional()
      .openapi({ example: "2025-10-13T09:00:00.000Z" }),
    updatedAt: z.coerce
      .date()
      .optional()
      .openapi({ example: "2025-10-13T09:00:00.000Z" }),
    version: z.int(),
  })
  .openapi("InvestorEntity");

export const CreateInvestorProfileInputSchema = z
  .object({
    bio: z.string().max(600).optional().openapi({
      example: "Angel investor backing early-stage African startups.",
    }),
    websiteURL: z.url("Invalid url").optional().openapi({
      example: "https://www.investorportfolio.com",
    }),
    experienceLevel: z
      .enum(
        Object.values(EXPERIENCE_LEVELS) as [
          ExperienceLevel,
          ...ExperienceLevel[],
        ],
      )
      .default(EXPERIENCE_LEVELS.YEAR_0_1)
      .openapi({
        example: "0-1 year",
      }),
    location: z.string().openapi({
      example: "UK",
    }),
  })
  .openapi({
    title: "Create Investor Profile",
  });

export const UpdateInvestorProfileInputSchema = z
  .object({
    bio: z.string().max(600).optional().openapi({
      example: "Seasoned venture capitalist with a focus on healthtech.",
    }),
    websiteURL: z.url("Invalid url").optional().openapi({
      example: "https://www.vcgroup.com",
    }),
    experienceLevel: z
      .enum(
        Object.values(EXPERIENCE_LEVELS) as [
          ExperienceLevel,
          ...ExperienceLevel[],
        ],
      )
      .optional()
      .openapi({
        example: "SENIOR",
      }),
    investorType: z
      .enum(Object.values(INVESTOR_TYPES) as [InvestorType, ...InvestorType[]])
      .optional()
      .openapi({
        example: "VC",
      }),
    disciplineSlugs: z
      .array(z.string())
      .min(1, "At least one discipline is required")
      .optional()
      .openapi({
        example: ["fintech", "edtech"],
      }),
    investmentSize: z
      .enum(
        Object.values(INVESTMENT_SIZES) as [
          InvestmentSize,
          ...InvestmentSize[],
        ],
      )
      .optional()
      .openapi({
        example: "SEED",
      }),
    geographicFocus: z
      .enum(
        Object.values(GEOGRAPHIC_FOCUS) as [
          GeographicFocus,
          ...GeographicFocus[],
        ],
      )
      .optional()
      .openapi({
        example: "GLOBAL",
      }),
    location: z.string().optional().openapi({
      example: "UK",
    }),
    version: z.int(),
  })
  .openapi({
    title: "Update Investor Profile",
  });

export const ListInvestorsInputSchema = z
  .object({
    query: z.string().optional().openapi({ example: "creative tech investor" }),
    disciplines: z
      .array(z.string())
      .optional()
      .openapi({ example: ["branding", "UX"] }),
    experienceLevels: z
      .array(
        z.enum(
          Object.values(EXPERIENCE_LEVELS) as [
            ExperienceLevel,
            ...ExperienceLevel[],
          ],
        ),
      )
      .optional()
      .openapi({
        description: "Filter based on the required experience level.",
      }),
    location: z.string().optional().openapi({ example: "San Francisco" }),
    tags: z
      .array(z.string())
      .optional()
      .openapi({ example: ["design", "future"] }),
    page: z.number().int().min(1).default(1).optional().openapi({ example: 1 }),
    perPage: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .optional()
      .openapi({ example: 20 }),
  })
  .openapi("ListInvestorsInput");

export const GetInvestorParamsSchema = z.object({
  value: CuidSchema,
});

export const GetInvestorQuerySchema = ProfileIdentifierSchema;

export const CreateInvestorOutputSchema = InvestorEntitySchema;

export const GetInvestorOutputSchema = InvestorEntitySchema;

export const UpdateInvestorOutputSchema = InvestorEntitySchema;
