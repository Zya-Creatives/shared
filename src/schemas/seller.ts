import { z } from "@hono/zod-openapi";
import { COUNTRY_OF_OPERATION, SELLER_STATUS } from "../constants";
import { PayoutMethodEntitySchema } from "./payout-method";

/**
 * --------------------------------
 * ENTITY
 * --------------------------------
 */

export const SellerEntitySchema = z.object({
  id: z.cuid2(),
  businessName: z.string(),
  countryOfOperation: z.enum(COUNTRY_OF_OPERATION),
  stripeConnectId: z.string().nullable(),
  paystackSubaccountCode: z.string().nullable(),
  status: z.enum(SELLER_STATUS).default(SELLER_STATUS.PENDING),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type SellerEntity = z.infer<typeof SellerEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

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

/**
 * --------------------------------
 * PROFILE
 * --------------------------------
 */

export const SellerProfileSchema = SellerEntitySchema.extend({
  payoutMethods: z.array(PayoutMethodEntitySchema),
});

export type SellerProfile = z.infer<typeof SellerProfileSchema>;

/**
 * --------------------------------
 * STRIPE ONBOARDING
 * --------------------------------
 */

export const GetStripeOnboardingUrlInputSchema = z.object({
  refreshUrl: z.url(),
  returnUrl: z.url(),
});

export type GetStripeOnboardingUrlInput = z.infer<
  typeof GetStripeOnboardingUrlInputSchema
>;

export const GetStripeOnboardingUrlOutputSchema = z.object({
  url: z.url(),
});

export type GetStripeOnboardingUrlOutput = z.infer<
  typeof GetStripeOnboardingUrlOutputSchema
>;
