import z from "zod";
import {
  SIGNAL_INTEREST_TYPES,
  SIGNAL_STATUS,
  VENTURE_STAGES,
  WAGES_CURRENCY,
} from "../constants";

export const InvestorSignalEntitySchema = z.object({
  id: z.cuid2(),
  userId: z.cuid2(),
  projectId: z.cuid2(),
  projectCreatorImage: z.url().optional(),
  projectCreatorName: z.string(),
  projectTotalRaising: z.string(),
  projectTotalRaisingCurrency: z.enum(WAGES_CURRENCY),
  projectVentureStage: z.enum(VENTURE_STAGES),
  signalInterestType: z.enum(SIGNAL_INTEREST_TYPES),
  interestDetails: z.string().max(600),
  signalStatus: z.enum(SIGNAL_STATUS).default("PENDING"),
  createdAt: z.coerce.date(),
  version: z.int(),
  updatedAt: z.coerce.date(),
});

export const CreateInvestorSignalInputSchema = z.object({
  projectId: z.cuid2(),
  signalInterestType: z.enum(SIGNAL_INTEREST_TYPES),
  interestDetails: z.string().max(600),
});

export const UpdateInvestorSignalStatusSchema = z.object({
  id: z.cuid2(),
  signalStatus: z.enum(SIGNAL_STATUS).default("PENDING"),
  version: z.int(),
});

export const GetInvestorSignalInputSchema = z.object({
  cursor: z.string().optional().nullable(),
  signalStatus: z.enum(SIGNAL_STATUS).optional().nullable(),
});

export const GetInvestorSignalOutputSchema = z.object({
  nextCursor: z.string().optional().nullable(),
  signals: z.array(InvestorSignalEntitySchema),
});
