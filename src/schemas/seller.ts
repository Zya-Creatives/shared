import { z } from "@hono/zod-openapi";
import { COUNTRY_OF_OPERATION, SELLER_STATUS } from "../constants";
import { PayoutMethodEntitySchema } from "./payout-method";

export const SellerEntitySchema = z.object({
  id: z.cuid2(),
  businessName: z.string(),
  countryOfOperation: z.enum(COUNTRY_OF_OPERATION),
  stripeConnectId: z.string().nullable(),
  paystackSubaccountCode: z.string().nullable(),
  status: z.enum(SELLER_STATUS).default(SELLER_STATUS.PENDING),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SellerEntity = z.infer<typeof SellerEntitySchema>;

export const CreateSellerEntityInputSchema = z.object({
  countryOfOperation: z.enum(COUNTRY_OF_OPERATION),
  bankCode: z.string().nullable(),
  accountNumber: z.string(),
  accountName: z.string(),
});

export type CreateSellerInput = z.infer<typeof CreateSellerEntityInputSchema>;

export const UpdateSellerEntitySchema = z
  .object({
    countryOfOperation: z.enum(COUNTRY_OF_OPERATION),
    stripeConnectId: z.string().nullable(),
    paystackSubaccountCode: z.string().nullable(),
    status: z.enum(SELLER_STATUS),
  })
  .partial();

export type UpdateSellerInput = z.infer<typeof UpdateSellerEntitySchema>;

export const SellerProfileSchema = SellerEntitySchema.extend({
  payoutMethods: z.array(PayoutMethodEntitySchema),
});

export type SellerProfile = z.infer<typeof SellerProfileSchema>;

export const GetStripeOnboardingUrlInputSchema = z.object({
  refreshUrl: z.string().url(),
  returnUrl: z.string().url(),
});

export const GetStripeOnboardingUrlOutputSchema = z.object({
  url: z.string().url(),
});
