import { z } from "@hono/zod-openapi";
import { ProfileIdentifierSchema } from "./common";
import { LINK_TYPES } from "../constants";
import { MinimalUserSchema } from "./user";

export const MinimalBrandEntitySchema = z.object({
  id: z.cuid2().openapi({ example: "brd_cksd0v6q0000s9a5y8z7p3x9" }),
  userId: z.cuid2().openapi({ example: "user_owner_123" }),
  brandName: z.string().openapi({ example: "TechInnovate Inc." }),
  bio: z.string().optional().openapi({
    example: "Leading software development firm focused on AI.",
  }),

  disciplines: z
    .array(z.string())
    .optional()
    .openapi({ example: ["Marketing", "Product Development"] }),
  createdAt: z.coerce
    .date()
    .optional()
    .openapi({ example: "2025-10-13T09:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ example: "2025-10-13T09:00:00.000Z" }),
});

export const BrandEntitySchema = z
  .object({
    id: z.cuid2().openapi({ example: "brd_cksd0v6q0000s9a5y8z7p3x9" }),
    userId: z.cuid2().openapi({ example: "user_owner_123" }),
    brandName: z.string().openapi({ example: "TechInnovate Inc." }),
    bio: z.string().optional().openapi({
      example: "Leading software development firm focused on AI.",
    }),
    disciplines: z
      .array(z.string())
      .optional()
      .openapi({ example: ["Marketing", "Product Development"] }),

    links: z
      .object({
        url: z.url(),
        type: z.enum(LINK_TYPES).default(LINK_TYPES.GENERIC_WEBSITE),
      })
      .array()
      .optional(),
    achievements: z
      .object({
        title: z.string(),
        link: z.url().optional(),
        year: z.number().int().optional(),
      })
      .array()
      .optional(),
    createdAt: z.coerce.date().openapi({ example: "2025-10-13T09:00:00.000Z" }),
    updatedAt: z.coerce.date().openapi({ example: "2025-10-13T09:00:00.000Z" }),
    version: z.int(),
  })
  .openapi("BrandEntitySchema");

export const CreateBrandProfileInputSchema = z
  .object({
    brandName: z
      .string()
      .min(1, "Brand name is required")
      .openapi({ example: "Acme Creative Studio" }),
    disciplineSlugs: z
      .array(z.string())
      .min(1, "At least one discipline is required")
      .default([])
      .openapi({ example: ["ui-ux", "frontend"] }),
  })
  .openapi({
    title: "create brand profile",
  });

export const UpdateBrandProfileInputSchema = z
  .object({
    brandName: z.string().min(1).optional().openapi({ example: "Acme Studio" }),
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
        link: z.url().optional(),
        year: z.number().int().optional(),
      })
      .array()
      .optional(),
    bio: z
      .string()
      .max(600)
      .optional()
      .openapi({ example: "Updated bio for our creative agency." }),
    disciplineSlugs: z
      .array(z.string())
      .min(1, "At least one discipline is required")
      .optional()
      .openapi({ example: ["frontend", "ui-ux"] }),
    version: z.int(),
  })
  .openapi({
    title: "update brand profile",
  });

export const GetBrandInputSchema = z.object({
  value: z.cuid2(),
  by: ProfileIdentifierSchema.shape.by,
});

export const GetBrandQuerySchema = ProfileIdentifierSchema;

export const CreateBrandOutputSchema = BrandEntitySchema;

export const GetBrandOutputSchema = BrandEntitySchema;

export const UpdateBrandOutputSchema = BrandEntitySchema;

export const BrandWithUserEntitySchema = MinimalBrandEntitySchema.extend({
  user: MinimalUserSchema,
});

export const SearchBrandInputSchema = z.object({
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

export const SearchBrandOutputSchema = z.object({
  brands: z.array(BrandWithUserEntitySchema),
  nextCursor: z.string().optional().nullable(),
});
