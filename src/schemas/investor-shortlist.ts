import { z } from "@hono/zod-openapi";

import { VENTURE_STAGES, WAGES_CURRENCY } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const InvestorShortlistShape = z.object({
  projectId: z.cuid2(),
  projectImage: z.url(),
  projectCreatorImage: z.url().optional(),
  projectCreatorName: z.string(),
  projectName: z.string(),
  projectTotalRaising: z.string(),
  projectTotalRaisingCurrency: z.enum(WAGES_CURRENCY),
  projectVentureStage: z.enum(VENTURE_STAGES).optional(),
});

export type InvestorShortlistShapeType = z.infer<typeof InvestorShortlistShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const InvestorShortlistEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),
    ...InvestorShortlistShape.shape,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("InvestorShortlist");

export type InvestorShortlistEntity = z.infer<
  typeof InvestorShortlistEntitySchema
>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateInvestorShortlistInputSchema = z.object({
  projectId: z.cuid2(),
});

export type CreateInvestorShortlistInput = z.infer<
  typeof CreateInvestorShortlistInputSchema
>;

export const GetInvestorShortlistInputSchema = z.object({
  cursor: z.string().optional(),
});

export type GetInvestorShortlistInput = z.infer<
  typeof GetInvestorShortlistInputSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const GetInvestorShortlistOutputSchema = z.object({
  nextCursor: z.string().optional(),
  shortlistItems: z.array(InvestorShortlistEntitySchema),
});

export type GetInvestorShortlistOutput = z.infer<
  typeof GetInvestorShortlistOutputSchema
>;
