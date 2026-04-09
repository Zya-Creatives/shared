import { z } from "@hono/zod-openapi";
import {
  DISCOUNT_TYPES,
  WAGES_CURRENCY,
  TRANSACTION_STATUSES,
  PAYMENT_PROVIDERS,
} from "../constants";

export const TransactionDiscountSnapshotSchema = z.object({
  code: z.string().optional(),
  amount: z.number().int("Amount must be a whole number"),
  type: z.enum(DISCOUNT_TYPES),
});

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

  discountApplied: TransactionDiscountSnapshotSchema.nullable().optional(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const InitTransactionInputSchema = z.object({
  productId: z
    .cuid2()
    .openapi({ description: "ID of the product being purchased" }),
  paymentProvider: z.enum(PAYMENT_PROVIDERS),
  discountCode: z
    .string()
    .optional()
    .openapi({ description: "Optional discount code applied at checkout" }),
  amount: z
    .number()
    .int("Amount must be a whole number (cents/kobo)")
    .min(0)
    .optional()
    .openapi({
      description:
        "Required for PWYW pricing. The amount the buyer chooses to pay in cents/kobo.",
    }),
});

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
  discountApplied: TransactionDiscountSnapshotSchema.optional(),
  providerTransactionId: z.string().optional(), 
});

export const UpdateTransactionWebhookInputSchema = z.object({
  status: z.enum(TRANSACTION_STATUSES),
  providerTransactionId: z.string(),
});

export const TransactionEntitySchema = BaseTransactionSchema.extend({
  productTitle: z.string().optional(),
  sellerName: z.string().optional(),
  sellerId: z.string().optional(),
  sellerUsername: z.string().optional(),
}).openapi({ title: "TransactionEntity" });

export type TransactionDiscountSnapshot = z.infer<
  typeof TransactionDiscountSnapshotSchema
>;

export type BaseTransactionEntity = z.infer<typeof BaseTransactionSchema>;

export type InitTransactionInput = z.infer<typeof InitTransactionInputSchema>;
export type CreateTransactionInput = z.infer<
  typeof CreateTransactionInputSchema
>;
export type UpdateTransactionWebhookInput = z.infer<
  typeof UpdateTransactionWebhookInputSchema
>;

export type TransactionEntity = z.infer<typeof TransactionEntitySchema>;
