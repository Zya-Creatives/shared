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
import { MinimalUserSchema } from "./user";

const WebsiteUrlInputSchema = z
  .string()
  .transform((val) => {
    if (!val) return val;
    if (val.startsWith("http://") || val.startsWith("https://")) {
      return val;
    }
    return `https://${val}`;
  })
  .pipe(z.url("Invalid URL").or(z.literal("")))
  .optional();

const InvestorLinkSchema = z.object({
  url: z.union([z.url({ message: "Please enter a valid URL" }), z.literal("")]),
  type: z.enum(LINK_TYPES),
});

const InvestorAchievementSchema = z.object({
  title: z.string(),
  link: z.string().optional(),
  year: z.coerce.number().int().optional(),
});

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

export type MinimalInvestorEntity = z.infer<typeof MinimalInvestorEntitySchema>;

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
    links: z.array(InvestorLinkSchema).optional(),
    achievements: z.array(InvestorAchievementSchema).optional(),
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

export type InvestorEntity = z.infer<typeof InvestorEntitySchema>;

export const InvestorWithUserEntitySchema = MinimalInvestorEntitySchema.extend({
  user: MinimalUserSchema,
});

export type InvestorWithUserEntity = z.infer<
  typeof InvestorWithUserEntitySchema
>;

export const CreateInvestorProfileInputSchema = z
  .object({
    websiteURL: WebsiteUrlInputSchema,
    experienceLevel: z
      .enum(
        Object.values(EXPERIENCE_LEVELS) as [
          ExperienceLevel,
          ...ExperienceLevel[],
        ],
      )
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

export type CreateInvestorInput = z.infer<
  typeof CreateInvestorProfileInputSchema
>;

export const UpdateInvestorProfileInputSchema = z
  .object({
    bio: z.string().max(600).optional().openapi({
      example: "Seasoned venture capitalist with a focus on healthtech.",
    }),
    websiteURL: WebsiteUrlInputSchema,
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
    links: z.array(InvestorLinkSchema).optional(),
    achievements: z.array(InvestorAchievementSchema).optional(),
    location: z.string().optional().openapi({
      example: "UK",
    }),
    version: z.int(),
  })
  .openapi({
    title: "Update Investor Profile",
  });

export type UpdateInvestorInput = z.infer<
  typeof UpdateInvestorProfileInputSchema
>;

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

export type ListInvestorsInput = z.infer<typeof ListInvestorsInputSchema>;

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

export type SearchInvestorInput = z.infer<typeof SearchInvestorInputSchema>;

export const GetInvestorParamsSchema = z.object({
  value: CuidSchema,
});

export type GetInvestorParams = z.infer<typeof GetInvestorParamsSchema>;

export const GetInvestorQuerySchema = ProfileIdentifierSchema;

export type GetInvestorQuery = z.infer<typeof GetInvestorQuerySchema>;

export const CreateInvestorOutputSchema = InvestorEntitySchema;

export type CreateInvestorOutput = z.infer<typeof CreateInvestorOutputSchema>;

export const GetInvestorOutputSchema = InvestorEntitySchema;

export type GetInvestorOutput = z.infer<typeof GetInvestorOutputSchema>;

export const UpdateInvestorOutputSchema = InvestorEntitySchema;

export type UpdateInvestorOutput = z.infer<typeof UpdateInvestorOutputSchema>;

export const SearchInvestorOutputSchema = z.object({
  investors: z.array(InvestorWithUserEntitySchema),
  nextCursor: z.string().optional().nullable(),
});

export type SearchInvestorOutput = z.infer<typeof SearchInvestorOutputSchema>;
