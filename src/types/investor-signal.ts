import type { z } from "zod";
import {
  CreateInvestorSignalInputSchema,
  GetInvestorSignalInputSchema,
  GetInvestorSignalOutputSchema,
  InvestorSignalEntitySchema,
  UpdateInvestorSignalStatusSchema,
} from "../schemas/investor-signal";

export type InvestorSignalEntity = z.infer<typeof InvestorSignalEntitySchema>;

export type CreateInvestorSignalInput = z.infer<
  typeof CreateInvestorSignalInputSchema
>;

export type UpdateInvestorSignalStatusInput = z.infer<
  typeof UpdateInvestorSignalStatusSchema
>;

export type GetInvestorSignalInput = z.infer<
  typeof GetInvestorSignalInputSchema
>;

export type GetInvestorSignalOutput = z.infer<
  typeof GetInvestorSignalOutputSchema
>;
