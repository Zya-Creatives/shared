import { z } from "@hono/zod-openapi";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const DisciplineShape = z.object({
  slug: z.string(),
  name: z.string(),
});

export type DisciplineShapeType = z.infer<typeof DisciplineShape>;

const TagShape = z.object({
  name: z.string(),
  disciplineSlug: z.string().optional(),
});

export type TagShapeType = z.infer<typeof TagShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const BaseDisciplineEntitySchema =
  DisciplineShape.openapi("BaseDiscipline");

export type BaseDisciplineEntity = z.infer<typeof BaseDisciplineEntitySchema>;

export const TagEntitySchema = z
  .object({
    id: z.int(),
    ...TagShape.shape,
  })
  .openapi("Tag");

export type TagEntity = z.infer<typeof TagEntitySchema>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */

export const DisciplineEntitySchema = BaseDisciplineEntitySchema.extend({
  tags: z.array(z.string()).optional(),
}).openapi("Discipline");

export type DisciplineEntity = z.infer<typeof DisciplineEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateDisciplinesInputSchema = z.object({
  disciplines: z.array(
    z.object({
      name: z.string().max(128),
      tags: z.array(z.string()).default([]),
    }),
  ),
});

export type CreateDisciplinesInput = z.infer<
  typeof CreateDisciplinesInputSchema
>;

export const GetDisciplinesInputSchema = z.object({
  withTags: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  getDefault: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  slugs: z.string().optional(),
});

export type GetDisciplinesInput = z.infer<typeof GetDisciplinesInputSchema>;

export const SlugInputSchema = z.object({
  slug: z.string().max(128),
});

export type SlugInput = z.infer<typeof SlugInputSchema>;

export const GetDisciplineTagsInputSchema = z.object({
  substring: z.string(),
});

export type GetDisciplineTagsInput = z.infer<
  typeof GetDisciplineTagsInputSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const DisciplineUpdateOutputSchema = z.object({
  slug: z.string(),
});

export type DisciplineUpdateOutput = z.infer<
  typeof DisciplineUpdateOutputSchema
>;

export const CreateDisciplinesOutputSchema = z.object({
  disciplines: z.array(z.string()),
});

export type CreateDisciplinesOutput = z.infer<
  typeof CreateDisciplinesOutputSchema
>;

export const GetDisciplinesOutputSchema = z.object({
  disciplines: z.array(DisciplineEntitySchema),
});

export type GetDisciplinesOutput = z.infer<typeof GetDisciplinesOutputSchema>;

export const GetDisciplineTagsOutputSchema = z.array(z.string());

export type GetDisciplineTagsOutput = z.infer<
  typeof GetDisciplineTagsOutputSchema
>;
