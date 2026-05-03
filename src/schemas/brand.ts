import { z } from "@hono/zod-openapi";
import { LINK_TYPES } from "../constants";
import { ProfileIdentifierSchema } from "./common";
import { MinimalUserSchema } from "./user";


const BrandShape = z.object({
  brandName: z.string().min(1).max(200),
  bio: z.string().max(600).default(""),
  location: z.string(),
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

export type BrandShapeType = z.infer<typeof BrandShape>;


export const BrandEntitySchema = z
  .object({
    id: z.cuid2().openapi({ example: "brd_cksd0v6q0000s9a5y8z7p3x9" }),
    userId: z.cuid2().openapi({ example: "user_owner_123" }),
    ...BrandShape.shape,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    version: z.int(),
  })
  .openapi("BrandEntity");

export type BrandEntity = z.infer<typeof BrandEntitySchema>;

export const MinimalBrandEntitySchema = BrandEntitySchema.pick({
  id: true,
  userId: true,
  brandName: true,
  bio: true,
  disciplines: true,
  createdAt: true,
  updatedAt: true,
});

export type MinimalBrandEntity = z.infer<typeof MinimalBrandEntitySchema>;

export const BrandWithUserEntitySchema = MinimalBrandEntitySchema.extend({
  user: MinimalUserSchema,
});

export type BrandWithUserEntity = z.infer<typeof BrandWithUserEntitySchema>;

export const CreateBrandProfileInputSchema = BrandShape.pick({
  brandName: true,
  location: true,
}).extend({
  disciplineSlugs: z
    .array(z.string())
    .min(1, "At least one discipline is required"),
});

export type CreateBrandProfileInput = z.infer<
  typeof CreateBrandProfileInputSchema
>;

export const UpdateBrandProfileInputSchema = BrandShape.partial()
  .extend({
    disciplineSlugs: z.array(z.string()).optional(),
    version: z.int(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "At least one field must be provided",
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

export const SearchBrandInputSchema = z.object({
  string: z.string().min(1, "Search string cannot be empty").max(200),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type SearchBrandInput = z.infer<typeof SearchBrandInputSchema>;

export const SearchBrandOutputSchema = z.object({
  brands: z.array(BrandWithUserEntitySchema),
  nextCursor: z.string().nullable().optional(),
});

export type SearchBrandOutput = z.infer<typeof SearchBrandOutputSchema>;

export const CreateBrandOutputSchema = BrandEntitySchema;
export type CreateBrandOutput = z.infer<typeof CreateBrandOutputSchema>;

export const GetBrandOutputSchema = BrandEntitySchema;
export type GetBrandOutput = z.infer<typeof GetBrandOutputSchema>;

export const UpdateBrandOutputSchema = BrandEntitySchema;
export type UpdateBrandOutput = z.infer<typeof UpdateBrandOutputSchema>;
