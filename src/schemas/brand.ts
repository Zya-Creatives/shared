import { z } from "@hono/zod-openapi";
import { LINK_TYPES } from "../constants";
import { ProfileIdentifierSchema } from "./common";
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

export type MinimalBrandEntity = z.infer<typeof MinimalBrandEntitySchema>;

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

export type BrandEntity = z.infer<typeof BrandEntitySchema>;

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

export type CreateBrandProfileInput = z.infer<
  typeof CreateBrandProfileInputSchema
>;

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

export type UpdateBrandProfileInput = z.infer<
  typeof UpdateBrandProfileInputSchema
>;

export const GetBrandInputSchema = z.object({
  value: z.cuid2(),
  by: ProfileIdentifierSchema.shape.by,
});

export type GetBrandInput = z.infer<typeof GetBrandInputSchema>;

export const GetBrandQuerySchema = ProfileIdentifierSchema;

export const CreateBrandOutputSchema = BrandEntitySchema;

export type CreateBrandOutput = z.infer<typeof CreateBrandOutputSchema>;

export const GetBrandOutputSchema = BrandEntitySchema;

export type GetBrandOutput = z.infer<typeof GetBrandOutputSchema>;

export const UpdateBrandOutputSchema = BrandEntitySchema;

export type UpdateBrandOutput = z.infer<typeof UpdateBrandOutputSchema>;

export const BrandWithUserEntitySchema = MinimalBrandEntitySchema.extend({
  user: MinimalUserSchema,
});

export type BrandWithUserEntity = z.infer<typeof BrandWithUserEntitySchema>;

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

export type SearchBrandInput = z.infer<typeof SearchBrandInputSchema>;

export const SearchBrandOutputSchema = z.object({
  brands: z.array(BrandWithUserEntitySchema),
  nextCursor: z.string().optional().nullable(),
});

export type SearchBrandOutput = z.infer<typeof SearchBrandOutputSchema>;
