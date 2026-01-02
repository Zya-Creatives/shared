import { z } from "@hono/zod-openapi";
import {
  BaseDisciplineEntitySchema,
  CreateDisciplinesInputSchema,
  CreateDisciplinesOutputSchema,
  DisciplineEntitySchema,
  DisciplineUpdateOutputSchema,
  GetDisciplinesInputSchema,
  GetDisciplinesOutputSchema,
  SlugInputSchema,
  TagEntitySchema,
} from "../schemas/discipline";

export type BaseDisciplineEntity = z.infer<typeof BaseDisciplineEntitySchema>;
export type DisciplineEntity = z.infer<typeof DisciplineEntitySchema>;

export type DisciplineUpdateOutput = z.infer<
  typeof DisciplineUpdateOutputSchema
>;

export type CreateDisciplinesInput = z.infer<
  typeof CreateDisciplinesInputSchema
>;
export type CreateDisciplinesOutput = z.infer<
  typeof CreateDisciplinesOutputSchema
>;

export type GetDisciplinesInput = z.infer<typeof GetDisciplinesInputSchema>;
export type GetDisciplinesOutput = z.infer<typeof GetDisciplinesOutputSchema>;

export type SlugInput = z.infer<typeof SlugInputSchema>;
export type TagEntity = z.infer<typeof TagEntitySchema>;
