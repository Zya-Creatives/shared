import { z } from "@hono/zod-openapi";

import {
  DISCOUNT_TYPES,
  PRICING_MODELS,
  PRODUCT_STATUS,
  WAGES_CURRENCY,
} from "../constants";

import { CreateFileInputSchema, FileEntitySchema } from "./file";

/**
 * --------------------------------
 * SHARED
 * --------------------------------
 */

export const ProductDiscountEntitySchema = z.object({
  discountType: z.enum(DISCOUNT_TYPES),
  amount: z.number().int().min(0),
  discountCode: z.string().optional(),
  active: z.boolean().default(true),
});

export type ProductDiscountEntity = z.infer<typeof ProductDiscountEntitySchema>;

export const ProductLinkSchema = z.object({
  title: z.string().nullable(),
  url: z.string(),
});

export type ProductLink = z.infer<typeof ProductLinkSchema>;

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const ProductShape = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  keyFeatures: z.string(),

  status: z.enum(PRODUCT_STATUS).default("DRAFT"),

  category: z.string().min(1),
  subcategory: z.string().optional(),

  tags: z.array(z.string()).max(10).default([]),

  currency: z.enum(WAGES_CURRENCY),
  pricingModel: z.enum(PRICING_MODELS).default(PRICING_MODELS.FIXED),
  price: z.number().int().min(0).optional(),
  suggestedPrice: z.number().int().min(0).optional(),

  discounts: z.array(ProductDiscountEntitySchema).max(3).default([]),
});

export type ProductShapeType = z.infer<typeof ProductShape>;

const ProductComplianceShape = z.object({
  supportEmail: z.email(),
  supportPhone: z.string().optional(),

  ownsRights: z.literal(true),
  noHarmfulContent: z.literal(true),
  providesSupport: z.boolean(),
  agreesToTerms: z.literal(true),
});

export type ProductComplianceShapeType = z.infer<typeof ProductComplianceShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const ProductEntitySchema = z
  .object({
    id: z.cuid2(),

    sellerId: z.cuid2(),
    sellerUsername: z.string(),
    sellerName: z.string(),
    sellerImageUrl: z.url().nullable().optional(),

    ...ProductShape.shape,

    subcategory: z.string().nullable().optional(),

    files: z.array(FileEntitySchema).default([]),
    productLinks: z.array(ProductLinkSchema).default([]),

    ownsRights: z.boolean(),
    noHarmfulContent: z.boolean(),
    providesSupport: z.boolean(),
    agreesToTerms: z.boolean(),

    supportEmail: z.email().nullable().optional(),
    supportPhone: z.string().nullable().optional(),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    deletedAt: z.iso.datetime().nullable().optional(),
  })
  .openapi("Product");

export type ProductEntity = z.infer<typeof ProductEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

const ProductCoreInputSchema = ProductShape.extend({
  id: z.cuid2(),

  files: z.array(CreateFileInputSchema).default([]),
  productLinks: z.array(ProductLinkSchema).default([]),
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
      (file) => file.parentType === "PRODUCT_DELIVERY",
    );

    const coverImages = data.files.filter(
      (file) => file.parentType === "PRODUCT_COVER",
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
      const thumbnails = coverImages.filter((image) => image.isThumbnail);

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

export type CreateProductInputEntity = z.infer<typeof CreateProductInputSchema>;

export const ProductServiceAndComplianceInputSchema =
  ProductComplianceShape.extend({
    id: z.cuid2(),
  }).openapi("ProductServiceAndComplianceInput");

export type ProductServiceAndComplianceInputEntity = z.infer<
  typeof ProductServiceAndComplianceInputSchema
>;

export const UpdateProductInputSchema = ProductCoreInputSchema.extend(
  ProductComplianceShape.shape,
)
  .partial()
  .extend({
    id: z.cuid2(),
  });

export type UpdateProductInputEntity = z.infer<typeof UpdateProductInputSchema>;

export const SearchProductInputSchema = z.object({
  queryString: z.string().max(200).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  tags: z.array(z.string()).optional(),
  filters: z.array(z.string()).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
});

export type SearchProductInput = z.infer<typeof SearchProductInputSchema>;

export const ProductDiscountCheckInputSchema = z.object({
  discountCode: z.string(),
  productId: z.cuid2(),
});

export type ProductDiscountCheckInput = z.infer<
  typeof ProductDiscountCheckInputSchema
>;

export const RevenueChartInputSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type RevenueChartInput = z.infer<typeof RevenueChartInputSchema>;

/**
 * --------------------------------
 * SEARCH / MARKETPLACE
 * --------------------------------
 */

export const ProductSearchDocumentSchema = z.object({
  id: z.cuid2(),

  sellerId: z.cuid2(),
  sellerUsername: z.string(),
  sellerName: z.string(),
  sellerImageUrl: z.url().nullable(),

  status: z.enum(PRODUCT_STATUS),

  title: z.string(),
  category: z.string(),
  subcategory: z.string().nullable(),
  tags: z.array(z.string()),

  thumbnailImgUrl: z.url().nullable(),

  currency: z.enum(WAGES_CURRENCY),
  price: z.number().nullable(),
  suggestedPrice: z.number().nullable(),

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable().optional(),
});

export type ProductSearchDocument = z.infer<typeof ProductSearchDocumentSchema>;

export const MarketplaceProductEntitySchema = ProductEntitySchema.omit({
  discounts: true,
});

export type MarketplaceProductEntity = z.infer<
  typeof MarketplaceProductEntitySchema
>;

export const MarketplaceCategorySchema = z.object({
  name: z.string(),
  imgUrl: z.url(),
  subcategories: z.array(z.string()),
});

export type MarketplaceCategoryOutput = z.infer<
  typeof MarketplaceCategorySchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const SearchProductOutputSchema = z.object({
  products: z.array(ProductSearchDocumentSchema),
  nextCursor: z.string().optional(),
});

export type SearchProductOutput = z.infer<typeof SearchProductOutputSchema>;

export const GetMarketplaceInfoOutputSchema = z.object({
  categories: z.array(MarketplaceCategorySchema),
  whatsHot: z.array(ProductSearchDocumentSchema),
  communityFavourites: z.array(ProductSearchDocumentSchema),
});

export type GetMarketplaceInfoOutput = z.infer<
  typeof GetMarketplaceInfoOutputSchema
>;

export const ProductDiscountCheckOutputSchema = z.object({
  exists: z.boolean(),
  discount: ProductDiscountEntitySchema.nullable(),
});

export type ProductDiscountCheckOutput = z.infer<
  typeof ProductDiscountCheckOutputSchema
>;

export const ProductStatsOutputSchema = z.object({
  salesToday: z.number().int(),
  revenueToday: z.number().int(),
  totalProductRevenue: z.number().int(),
});

export type ProductStatsOutput = z.infer<typeof ProductStatsOutputSchema>;

export const ProductTransactionItemSchema = z.object({
  id: z.string(),
  customerEmail: z.string().nullable(),
  orderId: z.string().nullable(),
  price: z.number().int(),
  status: z.string(),
  date: z.iso.datetime(),
});

export type ProductTransactionItem = z.infer<
  typeof ProductTransactionItemSchema
>;

export const ProductTransactionsOutputSchema = z.object({
  transactions: z.array(ProductTransactionItemSchema),
});

export type ProductTransactionsOutput = z.infer<
  typeof ProductTransactionsOutputSchema
>;

export const RevenueChartPointSchema = z.object({
  date: z.string(),
  revenue: z.number().int(),
});

export type RevenueChartPoint = z.infer<typeof RevenueChartPointSchema>;

export const ProductRevenueChartOutputSchema = z.object({
  chartData: z.array(RevenueChartPointSchema),
});

export type ProductRevenueChartOutput = z.infer<
  typeof ProductRevenueChartOutputSchema
>;

export const SellerDashboardStatsOutputSchema = z.object({
  totalSales: z.number().int(),
  totalViews: z.number().int(),
  totalProducts: z.number().int(),
  totalDrafts: z.number().int(),
});

export type SellerDashboardStatsOutput = z.infer<
  typeof SellerDashboardStatsOutputSchema
>;
