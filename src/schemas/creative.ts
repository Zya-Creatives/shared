import { z } from "@hono/zod-openapi";
import { EXPERIENCE_LEVELS, ExperienceLevel, LINK_TYPES } from "../constants";
import { ProfileIdentifierSchema } from "./common";
import { MinimalUserSchema } from "./user";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const CreativeShape = z.object({
  bio: z.string().max(600).default(""),
  role: z.string().default(""),
  location: z.string().max(100).default(""),
  experienceLevel: z.enum(
    Object.values(EXPERIENCE_LEVELS) as [ExperienceLevel, ...ExperienceLevel[]],
  ),
  disciplines: z.array(z.string()).default([]),

  workExperience: z
    .array(
      z.object({
        companyName: z.string(),
        position: z.string(),
        startDate: z.iso.datetime().optional(),
        endDate: z.iso.datetime().optional(),
        currentlyWorking: z.boolean().default(false),
        description: z.string().optional(),
      }),
    )
    .default([]),

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

export type CreativeShapeType = z.infer<typeof CreativeShape>;

/**
 * --------------------------------
 * ENTITY (DTO)
 * --------------------------------
 */

export const CreativeEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),
    ...CreativeShape.shape,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    version: z.int(),
  })
  .openapi("Creative");

export type CreativeEntity = z.infer<typeof CreativeEntitySchema>;

export const MinimalCreativeEntitySchema = CreativeEntitySchema.pick({
  id: true,
  userId: true,
  bio: true,
  role: true,
  location: true,
  experienceLevel: true,
  disciplines: true,
  createdAt: true,
  updatedAt: true,
});

export type MinimalCreativeEntity = z.infer<typeof MinimalCreativeEntitySchema>;

/**
 * --------------------------------
 * INPUT DTOs
 * --------------------------------
 */

export const CreateCreativeProfileInputSchema = CreativeShape.pick({
  experienceLevel: true,
  role: true,
  location: true,
}).extend({
  disciplineSlugs: z
    .array(z.string())
    .min(1, "At least one discipline is required"),
});

export type CreateCreativeProfileInput = z.infer<
  typeof CreateCreativeProfileInputSchema
>;

export const UpdateCreativeProfileInputSchema = CreativeShape.partial()
  .extend({
    disciplineSlugs: z.array(z.string()).optional(),
    version: z.int(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type UpdateCreativeProfileInput = z.infer<
  typeof UpdateCreativeProfileInputSchema
>;

/**
 * --------------------------------
 * GET
 * --------------------------------
 */

export const GetCreativeInputSchema = z.object({
  value: z.cuid2(),
  by: ProfileIdentifierSchema.shape.by,
});

export type GetCreativeInput = z.infer<typeof GetCreativeInputSchema>;

export const GetCreativeQuerySchema = ProfileIdentifierSchema;

/**
 * --------------------------------
 * OUTPUT ALIASES
 * --------------------------------
 */

export const CreateCreativeOutputSchema = CreativeEntitySchema;
export type CreateCreativeOutput = z.infer<typeof CreateCreativeOutputSchema>;

export const GetCreativeOutputSchema = CreativeEntitySchema;
export type GetCreativeOutput = z.infer<typeof GetCreativeOutputSchema>;

export const UpdateCreativeOutputSchema = CreativeEntitySchema;
export type UpdateCreativeOutput = z.infer<typeof UpdateCreativeOutputSchema>;

/**
 * --------------------------------
 * ENTITY WITH USER
 * --------------------------------
 */

export const CreativeWithUserEntitySchema = MinimalCreativeEntitySchema.extend({
  user: MinimalUserSchema,
});

export type CreativeWithUserEntity = z.infer<
  typeof CreativeWithUserEntitySchema
>;

/**
 * --------------------------------
 * SEARCH
 * --------------------------------
 */

export const SearchCreativeInputSchema = z.object({
  string: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type SearchCreativeInput = z.infer<typeof SearchCreativeInputSchema>;

export const SearchCreativeOutputSchema = z.object({
  creatives: z.array(CreativeWithUserEntitySchema),
  nextCursor: z.string().optional().nullable(),
});

export type SearchCreativeOutput = z.infer<typeof SearchCreativeOutputSchema>;
