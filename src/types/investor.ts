import { z } from "@hono/zod-openapi";
import {
  CreateInvestorOutputSchema,
  CreateInvestorProfileInputSchema,
  GetInvestorOutputSchema,
  GetInvestorParamsSchema,
  GetInvestorQuerySchema,
  InvestorEntitySchema,
  InvestorWithUserEntitySchema,
  ListInvestorsInputSchema,
  MinimalInvestorEntitySchema,
  SearchInvestorInputSchema,
  SearchInvestorOutputSchema,
  UpdateInvestorOutputSchema,
  UpdateInvestorProfileInputSchema,
} from "../schemas/investor";

export type InvestorEntity = z.infer<typeof InvestorEntitySchema>;

export type MinimalInvestorEntity = z.infer<typeof MinimalInvestorEntitySchema>;

export type InvestorWithUserEntity = z.infer<
  typeof InvestorWithUserEntitySchema
>;

export type ListInvestorsInput = z.infer<typeof ListInvestorsInputSchema>;

export type CreateInvestorInput = z.infer<
  typeof CreateInvestorProfileInputSchema
>;

export type UpdateInvestorInput = z.infer<
  typeof UpdateInvestorProfileInputSchema
>;

export type SearchInvestorInput = z.infer<typeof SearchInvestorInputSchema>;

export type GetInvestorParams = z.infer<typeof GetInvestorParamsSchema>;

export type GetInvestorQuery = z.infer<typeof GetInvestorQuerySchema>;

export type CreateInvestorOutput = z.infer<typeof CreateInvestorOutputSchema>;

export type GetInvestorOutput = z.infer<typeof GetInvestorOutputSchema>;

export type UpdateInvestorOutput = z.infer<typeof UpdateInvestorOutputSchema>;

export type SearchInvestorOutput = z.infer<typeof SearchInvestorOutputSchema>;
