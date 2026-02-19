import type { z } from "zod";
import { CreateInvestorShortlistInputSchema, GetInvestorShortlistInputSchema, GetInvestorShortlistOutputSchema, InvestorShortlistEntitySchema } from "../schemas/investor-shortlist";

export type InvestorShortlistEntity = z.infer<
  typeof InvestorShortlistEntitySchema
>;

export type CreateInvestorShortlistInput = z.infer<
  typeof CreateInvestorShortlistInputSchema
>;

export type GetInvestorShortlistInput = z.infer<
  typeof GetInvestorShortlistInputSchema
>;

export type GetInvestorShortlistOutput = z.infer<
  typeof GetInvestorShortlistOutputSchema
>;
