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
  LINK_TYPES,
} from "../constants";
import { CuidSchema, ProfileIdentifierSchema } from "./common";
import { MinimalUserSchema } from "./user";

export const MinimalInvestorEntitySchema = z.object({
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
  investorType: z
    .enum(Object.values(INVESTOR_TYPES) as [InvestorType, ...InvestorType[]])
    .optional()
    .openapi({ example: "VC" }),
  investmentSize: z
    .enum(
      Object.values(INVESTMENT_SIZES) as [InvestmentSize, ...InvestmentSize[]],
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
});

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
    links: z
      .object({
        url: z.union([
          z.url({ message: "Please enter a valid URL" }),
          z.literal(""),
        ]),
        type: z.enum(LINK_TYPES),
      })
      .array()
      .optional(),
    achievements: z
      .object({
        title: z.string(),
        link: z.string().optional(),
        year: z.coerce.number().int().optional(),
      })
      .array()
      .optional(),
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

export const InvestorWithUserEntitySchema = MinimalInvestorEntitySchema.extend({
  user: MinimalUserSchema,
});

export const CreateInvestorProfileInputSchema = z
  .object({
    websiteURL: z
      .string()
      .transform((val) => {
        if (!val) return val;
        if (val.startsWith("http://") || val.startsWith("https://")) {
          return val;
        }
        return `https://${val}`;
      })
      .pipe(z.url("Invalid URL").or(z.literal("")))
      .optional(),
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
    websiteURL: z
      .string()
      .transform((val) => {
        if (!val) return val;
        if (val.startsWith("http://") || val.startsWith("https://")) {
          return val;
        }
        return `https://${val}`;
      })
      .pipe(z.url("Invalid URL").or(z.literal("")))
      .optional(),
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
    links: z
      .object({
        url: z.union([
          z.url({ message: "Please enter a valid URL" }),
          z.literal(""),
        ]),
        type: z.enum(LINK_TYPES),
      })
      .array()
      .optional(),
    achievements: z
      .object({
        title: z.string(),
        link: z.string().optional(),
        year: z.coerce.number().int().optional(),
      })
      .array()
      .optional(),
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

export const SearchInvestorInputSchema = z.object({
  string: z
    .string()
    .min(1, { message: "Search string cannot be empty" })
    .max(200, { message: "Search string cannot exceed 200 characters" }),
  limit: z.coerce
    .number()
    .int({ message: "Limit must be an integer" })
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit cannot exceed 100" })
    .default(20),
  cursor: z.string().optional(),
});

export const GetInvestorParamsSchema = z.object({
  value: CuidSchema,
});

export const GetInvestorQuerySchema = ProfileIdentifierSchema;

export const CreateInvestorOutputSchema = InvestorEntitySchema;

export const GetInvestorOutputSchema = InvestorEntitySchema;

export const UpdateInvestorOutputSchema = InvestorEntitySchema;

export const SearchInvestorOutputSchema = z.object({
  investors: z.array(InvestorWithUserEntitySchema),
  nextCursor: z.string().optional().nullable(),
});
