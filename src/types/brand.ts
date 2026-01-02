import { z } from "@hono/zod-openapi";
import {
  BrandEntitySchema,
  ListBrandsInputSchema,
  CreateBrandProfileInputSchema,
  UpdateBrandProfileInputSchema,
  GetBrandInputSchema,
  CreateBrandOutputSchema,
  GetBrandOutputSchema,
  UpdateBrandOutputSchema,
  BrandWithUserEntitySchema,
  SearchBrandInputSchema,
  SearchBrandOutputSchema,
  MinimalBrandEntitySchema,
} from "../schemas/brand";

export type BrandEntity = z.infer<typeof BrandEntitySchema>;

export type ListBrandsInput = z.infer<typeof ListBrandsInputSchema>;

export type CreateBrandProfileInput = z.infer<
  typeof CreateBrandProfileInputSchema
>;

export type UpdateBrandProfileInput = z.infer<
  typeof UpdateBrandProfileInputSchema
>;

export type GetBrandInput = z.infer<typeof GetBrandInputSchema>;

export type CreateBrandOutput = z.infer<typeof CreateBrandOutputSchema>;

export type GetBrandOutput = z.infer<typeof GetBrandOutputSchema>;

export type UpdateBrandOutput = z.infer<typeof UpdateBrandOutputSchema>;

export type BrandWithUserEntity = z.infer<typeof BrandWithUserEntitySchema>
export type SearchBrandInput = z.infer<typeof SearchBrandInputSchema>
export type SearchBrandOutput = z.infer<typeof SearchBrandOutputSchema>

export type MinimalBrandEntity = z.infer<typeof MinimalBrandEntitySchema>