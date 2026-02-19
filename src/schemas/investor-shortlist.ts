import z from "zod";
import { VENTURE_STAGES, WAGES_CURRENCY } from "../constants";

export const InvestorShortlistEntitySchema = z.object({
  id: z.cuid2(),
  userId: z.cuid2(),
  projectId: z.cuid2(),
  projectCreatorImage: z.url().optional(),
  projectCreatorName: z.string(),
  projectTotalRaising: z.string(),
  projectTotalRaisingCurrency: z.enum(WAGES_CURRENCY),
  projectVentureStage: z.enum(VENTURE_STAGES).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateInvestorShortlistInputSchema = z.object({
  projectId: z.cuid2(),
});

export const GetInvestorShortlistInputSchema = z.object({
  cursor: z.string().optional().nullable(),
});

export const GetInvestorShortlistOutputSchema = z.object({
  nextCursor: z.string().optional().nullable(),
  shortlistItems: z.array(InvestorShortlistEntitySchema),
});
