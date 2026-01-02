import { z } from "@hono/zod-openapi";
import {
  CreativeEntitySchema,
  ListCreativesInputSchema,
  CreateCreativeProfileInputSchema,
  UpdateCreativeProfileInputSchema,
  GetCreativeInputSchema,
  CreateCreativeOutputSchema,
  GetCreativeOutputSchema,
  UpdateCreativeOutputSchema,
  CreativeWithUserEntitySchema,
  SearchCreativeInputSchema,
  SearchCreativeOutputSchema,
  MinimalCreativeEntitySchema,
} from "../schemas/creative";

export type CreativeEntity = z.infer<typeof CreativeEntitySchema>;

export type ListCreativesInput = z.infer<typeof ListCreativesInputSchema>;

export type CreateCreativeProfileInput = z.infer<
  typeof CreateCreativeProfileInputSchema
>;
export type UpdateCreativeProfileInput = z.infer<
  typeof UpdateCreativeProfileInputSchema
>;

export type GetCreativeInput = z.infer<typeof GetCreativeInputSchema>;

export type CreateCreativeOutput = z.infer<typeof CreateCreativeOutputSchema>;
export type GetCreativeOutput = z.infer<typeof GetCreativeOutputSchema>;
export type UpdateCreativeOutput = z.infer<typeof UpdateCreativeOutputSchema>;

export type CreativeWithUserEntity = z.infer<typeof CreativeWithUserEntitySchema>
export type SearchCreativeInput = z.infer<typeof SearchCreativeInputSchema>
export type SearchCreativeOutput = z.infer<typeof SearchCreativeOutputSchema>
export type MinimalCreativeEntity = z.infer<typeof MinimalCreativeEntitySchema>