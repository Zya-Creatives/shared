import { z } from "@hono/zod-openapi";
import {
  WAGES_CURRENCY,
  TRANSACTION_STATUSES,
  PAYMENT_PROVIDERS,
} from "../constants";
import { ProductDiscountEntitySchema } from "./product";

/**
 * --------------------------------
 * BASE
 * --------------------------------
 */

export const BaseTransactionSchema = z.object({
  id: z.cuid2(),
  productId: z.cuid2(),
  buyerId: z.cuid2(),
  sellerId: z.cuid2(),

  amount: z.number().int(),
  platformFee: z.number().int(),
  sellerAmount: z.number().int(),
  currency: z.enum(WAGES_CURRENCY),

  status: z.enum(TRANSACTION_STATUSES).default("PENDING"),
  paymentProvider: z.enum(PAYMENT_PROVIDERS),
  providerTransactionId: z.string().nullable().optional(),

  discountApplied: ProductDiscountEntitySchema.nullable().optional(),
  productNameSnapshot: z.string().optional(),

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type BaseTransactionEntity = z.infer<typeof BaseTransactionSchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const InitTransactionInputSchema = z.object({
  productId: z
    .cuid2()
    .openapi({ description: "ID of the product being purchased" }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email(),
  discountCode: z.string().optional(),
  amount: z.number().int("Amount must be a whole number (cents/kobo)").min(0),
});

export type InitTransactionInput = z.infer<typeof InitTransactionInputSchema>;

export const CreateTransactionInputSchema = BaseTransactionSchema.pick({
  productId: true,
  buyerId: true,
  sellerId: true,
  amount: true,
  platformFee: true,
  sellerAmount: true,
  currency: true,
  paymentProvider: true,
  status: true,
}).extend({
  discountApplied: ProductDiscountEntitySchema.optional(),
  providerTransactionId: z.string().optional(),
});

export type CreateTransactionInput = z.infer<
  typeof CreateTransactionInputSchema
>;

export const UpdateTransactionWebhookInputSchema = z.object({
  status: z.enum(TRANSACTION_STATUSES),
  providerTransactionId: z.string(),
});

export type UpdateTransactionWebhookInput = z.infer<
  typeof UpdateTransactionWebhookInputSchema
>;

/**
 * --------------------------------
 * ENTITY
 * --------------------------------
 */

export const TransactionEntitySchema = BaseTransactionSchema.extend({
  productTitle: z.string().optional(),

  sellerName: z.string().optional(),
  sellerUsername: z.string().optional(),

  buyerName: z.string().optional(),
  buyerUsername: z.string().optional(),
  buyerEmail: z.email(),
}).openapi({ title: "TransactionEntity" });

export type TransactionEntity = z.infer<typeof TransactionEntitySchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const InitTransactionOutputSchema = z
  .object({
    transaction: TransactionEntitySchema,
    checkoutUrl: z.url().nullable().openapi({
      description: "The Stripe/Paystack checkout URL to redirect the user to",
    }),
  })
  .openapi({ title: "InitTransactionResult" });

export type InitTransactionResult = z.infer<typeof InitTransactionOutputSchema>;
