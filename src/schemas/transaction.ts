import { z } from "@hono/zod-openapi";
import {
  WAGES_CURRENCY,
  TRANSACTION_STATUSES,
  PAYMENT_PROVIDERS,
} from "../constants";
import {
  ProductDiscountEntitySchema,
  ProductPurchaseSnapshotSchema,
} from "./product";

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

  productSnapshot: ProductPurchaseSnapshotSchema.nullable().optional(),

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

  amount: z
    .number()
    .int("Amount must be a whole number in the smallest currency unit")
    .min(0),
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
  discountApplied: ProductDiscountEntitySchema.nullable().optional(),
  providerTransactionId: z.string().optional(),
  productSnapshot: ProductPurchaseSnapshotSchema.nullable().optional(),
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

export type InitTransactionResult = z.infer<
  typeof InitTransactionOutputSchema
>;

export const TransactionIdInputSchema = z.object({
  transactionId: z.cuid2().openapi({ example: "ckj1a2b3c0000xyz" }),
});

export type TransactionIdInput = z.infer<typeof TransactionIdInputSchema>;

export const PurchaseLibraryInputSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PurchaseLibraryInput = z.infer<
  typeof PurchaseLibraryInputSchema
>;

export const PurchaseLibraryItemSchema = z.object({
  transactionId: z.cuid2(),
  productId: z.cuid2(),
  itemName: z.string(),
  creator: z.object({
    id: z.cuid2(),
    name: z.string(),
    username: z.string(),
    image: z.url().nullable(),
  }),
  fileCategory: z.string().nullable(),
  purchaseDate: z.iso.datetime(),
  status: z.enum(["PURCHASED", "REFUNDED"]),
  currency: z.enum(WAGES_CURRENCY),
  amount: z.number().int(),
  thumbnailImgUrl: z.url().nullable(),
});

export type PurchaseLibraryItem = z.infer<
  typeof PurchaseLibraryItemSchema
>;

export const PurchaseLibraryOutputSchema = z.object({
  purchases: z.array(PurchaseLibraryItemSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    totalItems: z.number().int(),
    totalPages: z.number().int(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
  }),
});

export type PurchaseLibraryOutput = z.infer<
  typeof PurchaseLibraryOutputSchema
>;
