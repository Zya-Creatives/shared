import { z } from "@hono/zod-openapi";

import { GATEWAY_PROVIDER, PAYMENT_METHOD_STATUS } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const PayoutMethodShape = z.object({
  provider: z.enum(GATEWAY_PROVIDER),
  bankName: z.string(),
  accountLast4: z.string(),
  accountName: z.string(),
  externalBankId: z.string().nullable(),
  isDefault: z.boolean(),
});

export type PayoutMethodShapeType = z.infer<typeof PayoutMethodShape>;

/**
 * --------------------------------
 * ENTITY
 * --------------------------------
 */

export const PayoutMethodEntitySchema = z
  .object({
    id: z.cuid2(),
    sellerId: z.cuid2(),
    currency: z.string(),
    ...PayoutMethodShape.shape,
    status: z.enum(PAYMENT_METHOD_STATUS),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("PayoutMethod");

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreatePayoutMethodInputSchema = PayoutMethodShape.omit({
  externalBankId: true,
});

export const UpdatePayoutMethodInputSchema = PayoutMethodShape.partial();

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const VerifyAccountOutputSchema = z.object({
  accountName: z.string(),
});

export const BankListOutputSchema = z.array(
  z.object({
    name: z.string(),
    code: z.string(),
  }),
);
