import { z } from "@hono/zod-openapi";

export const BaseDisciplineEntitySchema = z.object({
  slug: z.string().openapi({ example: "digital-art" }),
  name: z.string().openapi({ example: "Digital Art" }),
});

export const TagEntitySchema = z.object({
  id: z.int(),
  name: z.string(),
  disciplineSlug: z.string().optional(),
});

export const DisciplineEntitySchema = BaseDisciplineEntitySchema.extend({
  tags: z
    .array(z.string().openapi({ example: "illustration" }))
    .optional()
    .openapi({ example: ["illustration", "concept-art"] }),
}).openapi({ title: "DisciplineEntity" });

export const DisciplineUpdateOutputSchema = z
  .object({
    slug: z.string().openapi({ example: "digital-art" }),
  })
  .openapi({ title: "DisciplineUpdateOutput" });

export const CreateDisciplinesInputSchema = z
  .object({
    disciplines: z
      .array(
        z.object({
          name: z.string().max(128).openapi({ example: "Mathematics" }),
          tags: z
            .array(z.string().openapi({ example: "algebra" }))
            .default([])
            .openapi({ example: ["algebra", "geometry"] }),
        })
      )
      .openapi({
        description: "Array of disciplines to upsert.",
        example: [
          { name: "Mathematics", tags: ["algebra", "geometry"] },
          { name: "Physics", tags: ["mechanics", "optics"] },
        ],
      }),
  })
  .openapi({ title: "CreateDisciplinesInput" });

export const CreateDisciplinesOutputSchema = z
  .object({
    disciplines: z.array(z.string()),
  })
  .openapi({ title: "CreateDisciplinesOutput" });

export const GetDisciplinesInputSchema = z
  .object({
    withTags: z
      .union([z.literal("true"), z.literal("false")])
      .optional()
      .openapi({
        description: "Whether to include tags in the response.",
        example: "true",
      }),
    getDefault: z
      .union([z.literal("true"), z.literal("false")])
      .optional()
      .openapi({
        description:
          "Fetch the default list of disciplines (non user-added disciplines).",
      }),
    slugs: z.string().optional().openapi({
      description: "Comma-separated list of discipline slugs to filter by.",
      example: "mathematics,physics",
    }),
  })
  .openapi({ title: "GetDisciplinesInput" });

export const GetDisciplinesOutputSchema = z
  .object({
    disciplines: z.array(DisciplineEntitySchema),
  })
  .openapi({ title: "GetDisciplinesOutput" });

export const SlugInputSchema = z
  .object({
    slug: z.string().max(128).openapi({ example: "mathematics" }),
  })
  .openapi({ title: "SlugInput" });
