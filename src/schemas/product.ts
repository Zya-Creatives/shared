import { z } from "@hono/zod-openapi";
import {
  DISCOUNT_TYPES,
  PRICING_MODELS,
  PRODUCT_STATUS,
  WAGES_CURRENCY,
} from "../constants";
import { CreateFileInputSchema, FileEntitySchema } from "./file";

export const ProductDiscountEntitySchema = z.object({
  discountType: z.enum(DISCOUNT_TYPES),
  amount: z
    .number()
    .int("Amount must be a whole number")
    .min(0, "Discount amount cannot be negative"),
  discountCode: z.string().optional(),
  active: z.boolean().default(true),
});

export const ProductLinkSchema = z.object({
  title: z.string().nullable(),
  url: z.string(),
});

const ProductCoreInputSchema = z.object({
  id: z.cuid2().openapi({ description: "Client-generated ID for the product" }),

  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  keyFeatures: z.string(),
  status: z.enum(PRODUCT_STATUS).default("DRAFT"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).max(10, "Keep tags to a maximum of 10").default([]),
  files: z.array(CreateFileInputSchema).default([]),
  productLinks: z.array(ProductLinkSchema).default([]),

  currency: z.enum(WAGES_CURRENCY),
  pricingModel: z.enum(PRICING_MODELS).default(PRICING_MODELS.FIXED),
  price: z.number().int("Must be a whole number").min(0).optional(),
  suggestedPrice: z.number().int("Must be in cents").min(0).optional(),
  discounts: z.array(ProductDiscountEntitySchema).max(3).default([]),
});

export const CreateProductInputSchema = ProductCoreInputSchema.superRefine(
  (data, ctx) => {

    if (
      data.pricingModel === PRICING_MODELS.FIXED &&
      (!data.price || data.price <= 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Fixed pricing requires a price strictly greater than 0.",
        path: ["price"],
      });
    }

    if (
      data.pricingModel === PRICING_MODELS.PWYW &&
      data.suggestedPrice !== undefined &&
      data.price !== undefined &&
      data.suggestedPrice < data.price
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Suggested price cannot be lower than the minimum price.",
        path: ["suggestedPrice"],
      });
    }

    if (
      data.pricingModel === PRICING_MODELS.FREE &&
      data.price &&
      data.price > 0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Free products cannot have a price greater than 0.",
        path: ["price"],
      });
    }

    const deliveryFiles = data.files.filter(
      (f) => f.parentType === "PRODUCT_DELIVERY",
    );
    const coverImages = data.files.filter(
      (f) => f.parentType === "PRODUCT_COVER",
    );

    if (deliveryFiles.length === 0 && data.productLinks.length === 0) {
      ctx.addIssue({
        code: "custom",
        message:
          "You must provide at least one product file or a link for the buyer to receive.",
        path: ["files"],
      });
    }

    if (coverImages.length < 1 || coverImages.length > 5) {
      ctx.addIssue({
        code: "custom",
        message: "Between 1 and 5 cover images are required.",
        path: ["files"],
      });
    } else {
      const thumbnails = coverImages.filter((img) => img.isThumbnail);
      if (thumbnails.length !== 1) {
        ctx.addIssue({
          code: "custom",
          message: "Exactly one cover image must be set as the thumbnail.",
          path: ["files"],
        });
      }
    }

    data.discounts.forEach((discount, index) => {
      const isPercentage =
        String(discount.discountType).toUpperCase() === "PERCENTAGE";
      const isFixed = String(discount.discountType).toUpperCase() === "FIXED";

      if (isPercentage && discount.amount >= 100) {
        ctx.addIssue({
          code: "custom",
          message: "Percentage discounts must be less than 100%.",
          path: ["discounts", index, "amount"],
        });
      }

      if (
        isFixed &&
        data.price !== undefined &&
        discount.amount >= data.price
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Fixed discount amounts must be less than the product price.",
          path: ["discounts", index, "amount"],
        });
      }
    });
  },
);

export const ProductServiceAndComplianceInputSchema = z.object({
  id: z.cuid2().openapi({ description: "ID of the product" }),
  supportEmail: z.email("A valid support email is required"),
  supportPhone: z.string().optional(),
  ownsRights: z.literal(
    true,
    '"You must confirm you own the rights to this product."',
  ),
  noHarmfulContent: z.literal(true, "You must confirm no harmful content."),
  providesSupport: z.boolean(),
  agreesToTerms: z.literal(true, "You must agree to the Terms."),
});

export const UpdateProductInputSchema = ProductCoreInputSchema.extend(
  ProductServiceAndComplianceInputSchema.omit({ id: true }).shape,
)
  .partial()
  .extend({
    id: z.cuid2().openapi({ description: "ID of the product being updated" }),
  });


export const ProductEntitySchema = z
  .object({
    id: z.cuid2(),
    sellerId: z.cuid2().openapi({ description: "ID of the creator/seller" }),
    sellerUsername: z.string(),
    sellerName: z.string(),
    sellerImageUrl: z.url().optional().nullable(),

    title: z.string(),
    description: z.string(),
    keyFeatures: z.string(),
    status: z.enum(PRODUCT_STATUS).default("DRAFT"),
    category: z.string(),
    subcategory: z.string().optional().nullable(),
    tags: z.array(z.string()),

    files: z.array(FileEntitySchema).default([]),
    productLinks: z.array(ProductLinkSchema).default([]),

    pricingModel: z.enum(PRICING_MODELS),
    currency: z.enum(WAGES_CURRENCY),
    price: z.number().int().optional().nullable(),
    suggestedPrice: z.number().int().optional().nullable(),
    discounts: z.array(ProductDiscountEntitySchema).default([]),

    ownsRights: z.boolean(),
    noHarmfulContent: z.boolean(),
    providesSupport: z.boolean(),
    agreesToTerms: z.boolean(),
    supportEmail: z.email().optional().nullable(),
    supportPhone: z.string().optional().nullable(),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().optional().nullable(),
  })
  .openapi({ title: "ProductEntity" });

export const ProductSearchDocumentSchema = z.object({
  id: z.cuid2(),
  sellerId: z.cuid2(),
  sellerUsername: z.string(),
  sellerName: z.string(),
  status: z.enum(PRODUCT_STATUS),
  sellerImageUrl: z.url().nullable(),
  title: z.string(),
  category: z.string(),
  subcategory: z.string().nullable(),
  tags: z.array(z.string()),
  thumbnailImgUrl: z.url().nullable(),
  currency: z.enum(WAGES_CURRENCY),
  price: z.number().nullable(),
  suggestedPrice: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const SearchProductInputSchema = z.object({
  queryString: z
    .string()
    .max(200, { message: "Search string cannot exceed 200 characters" })
    .optional()
    .openapi({ example: "typescript utility types" }),
  cursor: z.string().optional().openapi({ example: "ckj1a2b3c0000cur" }),
  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
  tags: z.array(z.string()).optional(),
  filters: z.array(z.string()).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
});

export const SearchProductOutputSchema = z.object({
  products: z.array(ProductSearchDocumentSchema),
  nextCursor: z.string().optional().nullable(),
});

export const MarketplaceCategorySchema = z.object({
  name: z.string(),
  imgUrl: z.url(),
  subcategories: z.array(z.string()),
});

export const GetMarketplaceInfoOutputSchema = z.object({
  categories: z.array(MarketplaceCategorySchema),
  whatsHot: z.array(ProductSearchDocumentSchema),
  communityFavourites: z.array(ProductSearchDocumentSchema),
});

export type ProductLink = z.infer<typeof ProductLinkSchema>;
export type SearchProductInput = z.infer<typeof SearchProductInputSchema>;
export type SearchProductOutput = z.infer<typeof SearchProductOutputSchema>;
export type MarketplaceCategoryOutput = z.infer<
  typeof MarketplaceCategorySchema
>;
export type GetMarketplaceInfoOutput = z.infer<
  typeof GetMarketplaceInfoOutputSchema
>;

export type ProductDiscountEntity = z.infer<typeof ProductDiscountEntitySchema>;
export type CreateProductInputEntity = z.infer<typeof CreateProductInputSchema>;
export type ProductServiceAndComplianceInputEntity = z.infer<
  typeof ProductServiceAndComplianceInputSchema
>;
export type UpdateProductInputEntity = z.infer<typeof UpdateProductInputSchema>;
export type ProductEntity = z.infer<typeof ProductEntitySchema>;
export type ProductSearchDocument = z.infer<typeof ProductSearchDocumentSchema>;
