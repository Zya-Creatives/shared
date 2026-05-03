import { z } from "@hono/zod-openapi";

import {
  SIGNAL_INTEREST_TYPES,
  SIGNAL_STATUS,
  VENTURE_STAGES,
  WAGES_CURRENCY,
} from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const InvestorSignalShape = z.object({
  projectId: z.cuid2(),
  signalInterestType: z.enum(SIGNAL_INTEREST_TYPES),
  interestDetails: z.string().max(600),
});

export type InvestorSignalShapeType = z.infer<typeof InvestorSignalShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const InvestorSignalEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),
    projectId: z.cuid2(),
    projectCreatorUserId: z.cuid2(),

    projectImage: z.url(),
    projectCreatorUsername: z.string(),
    projectName: z.string(),
    projectCreatorImage: z.url().optional(),
    projectCreatorName: z.string(),
    projectTotalRaising: z.string(),
    projectTotalRaisingCurrency: z.enum(WAGES_CURRENCY),
    projectVentureStage: z.enum(VENTURE_STAGES),

    signalInterestType: z.enum(SIGNAL_INTEREST_TYPES),
    interestDetails: z.string().max(600),
    signalStatus: z.enum(SIGNAL_STATUS).default("PENDING"),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    version: z.int(),
  })
  .openapi("InvestorSignal");

export type InvestorSignalEntity = z.infer<typeof InvestorSignalEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateInvestorSignalInputSchema = InvestorSignalShape.extend({});

export type CreateInvestorSignalInput = z.infer<
  typeof CreateInvestorSignalInputSchema
>;

export const UpdateInvestorSignalStatusInputSchema = z.object({
  id: z.cuid2(),
  signalStatus: z.enum(SIGNAL_STATUS),
  version: z.int(),
});

export type UpdateInvestorSignalStatusInput = z.infer<
  typeof UpdateInvestorSignalStatusInputSchema
>;

export const GetInvestorSignalInputSchema = z.object({
  cursor: z.string().optional(),
  signalStatus: z.enum(SIGNAL_STATUS).optional(),
});

export type GetInvestorSignalInput = z.infer<
  typeof GetInvestorSignalInputSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const GetInvestorSignalOutputSchema = z.object({
  nextCursor: z.string().optional(),
  signals: z.array(InvestorSignalEntitySchema),
});

export type GetInvestorSignalOutput = z.infer<
  typeof GetInvestorSignalOutputSchema
>;
