import z from "zod";
import { GATEWAY_PROVIDER, PAYMENT_METHOD_STATUS } from "../constants";
export const PayoutMethodEntitySchema = z.object({
  id: z.cuid2(),
  sellerId: z.cuid2(),
  provider: z.enum(GATEWAY_PROVIDER),
  currency: z.string(),
  bankName: z.string(),
  accountLast4: z.string(),
  accountName: z.string(),
  externalBankId: z.string().nullable(),
  isDefault: z.boolean(),
  status: z.enum(PAYMENT_METHOD_STATUS).default(PAYMENT_METHOD_STATUS.PENDING),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type PayoutMethodEntity = z.infer<typeof PayoutMethodEntitySchema>;

export const CreatePayoutMethodEntitySchema = z.object({
  provider: z.enum(GATEWAY_PROVIDER),
  bankName: z.string(),
  accountLast4: z.string(),
  accountName: z.string(),
  isDefault: z.boolean(),
});
export type CreatePayoutMethodInput = z.infer<
  typeof CreatePayoutMethodEntitySchema
>;

export const UpdatePayoutMethodEntitySchema = z
  .object({
    bankName: z.string(),
    accountLast4: z.string(),
    accountName: z.string(),
    isDefault: z.boolean(),
    status: z.enum(PAYMENT_METHOD_STATUS),
    externalBankId: z.string().nullable(),
  })
  .partial();

export type UpdatePayoutMethodInput = z.infer<
  typeof UpdatePayoutMethodEntitySchema
>;

export const GetBanksInputSchema = z.object({
  country: z
    .string()
    .default("nigeria")
    .openapi({
      param: { in: "query", name: "country" },
      example: "nigeria",
    }),
});

export type GetBanksInput = z.infer<typeof GetBanksInputSchema>;

export const VerifyAccountInputSchema = z
  .object({
    accountNumber: z.string().length(10, "Account number must be 10 digits"),
    bankCode: z.string().min(1, "Bank code is required"),
  })
  .openapi("VerifyAccountInput");

export type VerifyAccountInput = z.infer<typeof VerifyAccountInputSchema>;

export const VerifyAccountOutputSchema = z
  .object({
    accountName: z.string(),
  })
  .openapi("VerifyAccountOutput");

export type VerifyAccountOutput = z.infer<typeof VerifyAccountOutputSchema>;

export const BankListOutputSchema = z
  .array(
    z.object({
      name: z.string(),
      code: z.string(),
    }),
  )
  .openapi("BankListOutput");

export type BankListOutput = z.infer<typeof BankListOutputSchema>;
