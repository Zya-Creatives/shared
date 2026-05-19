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

export type PayoutMethodEntity = z.infer<typeof PayoutMethodEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreatePayoutMethodInputSchema = PayoutMethodShape.omit({
  externalBankId: true,
});

export type CreatePayoutMethodInput = z.infer<
  typeof CreatePayoutMethodInputSchema
>;

export const UpdatePayoutMethodInputSchema = PayoutMethodShape.partial();

export type UpdatePayoutMethodInput = z.infer<
  typeof UpdatePayoutMethodInputSchema
>;

export const GetBanksInputSchema = z.object({
  country: z.string().optional(),
});

export type GetBanksInput = z.infer<typeof GetBanksInputSchema>;

export const VerifyAccountInputSchema = z.object({
  accountNumber: z.string().regex(/^\d{10}$/),
  bankCode: z.string().min(1),
});

export type VerifyAccountInput = z.infer<typeof VerifyAccountInputSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const VerifyAccountOutputSchema = z.object({
  accountName: z.string(),
});

export type VerifyAccountOutput = z.infer<typeof VerifyAccountOutputSchema>;

export const BankListOutputSchema = z.array(
  z.object({
    name: z.string(),
    code: z.string(),
  }),
);

export type BankListOutput = z.infer<typeof BankListOutputSchema>;
