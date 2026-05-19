import { z } from "@hono/zod-openapi";

import {
  ACTIVITY_PARENT_TYPES,
  POST_BADGE_TYPES,
  POST_TYPES,
} from "../constants";

import { FileEntitySchema, CreateFileInputSchema } from "./file";
import { EntityStatsEntitySchema } from "./entity-stats";
import { cleanHtml } from "../utils/clean-html";

/**
 * --------------------------------
 * SHARED
 * --------------------------------
 */

export const LinkMetaSchema = z.object({
  url: z.url(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type LinkMeta = z.infer<typeof LinkMetaSchema>;

const PostTagSchema = z.object({
  id: z.int(),
  name: z.string(),
});

export type PostTag = z.infer<typeof PostTagSchema>;

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const PostShape = z.object({
  parentId: z.cuid2().optional(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).default(ACTIVITY_PARENT_TYPES.POST),

  content: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const plainText = cleanHtml(value, Number.MAX_SAFE_INTEGER);
        return plainText.length <= 300;
      },
      { message: "Post content cannot exceed 300 characters" },
    ),

  postType: z.enum(POST_TYPES).default("DEFAULT_POST"),
  badge: z.enum(POST_BADGE_TYPES).optional(),
  mentions: z.array(z.cuid2()).max(15).optional(),
  linkMeta: LinkMetaSchema.optional(),
});

export type PostShapeType = z.infer<typeof PostShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const PostEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),

    ...PostShape.shape,

    tags: z.array(PostTagSchema).optional(),

    creatorUsername: z.string().optional(),
    creatorFullName: z.string().optional(),
    creatorImageUrl: z.string().optional(),

    createdAt: z.iso.datetime(),
  })
  .openapi("Post");

export type PostEntity = z.infer<typeof PostEntitySchema>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */

export const PostWithFilesEntitySchema = PostEntitySchema.extend({
  files: z.array(FileEntitySchema).optional(),
}).openapi("PostWithFiles");

export type PostWithFilesEntity = z.infer<typeof PostWithFilesEntitySchema>;

export const MinimalPostSchema = PostEntitySchema.pick({
  id: true,
  parentId: true,
  content: true,
}).openapi("MinimalPost");

export type MinimalPost = z.infer<typeof MinimalPostSchema>;

export const FeedPostEntitySchema = PostWithFilesEntitySchema.extend({
  stats: EntityStatsEntitySchema,
  score: z.number(),
  isLiked: z.boolean().optional(),
  isFollowing: z.boolean().optional(),
  isBookmarked: z.boolean().optional(),
  canComment: z.boolean()
}).openapi("FeedPost");

export type FeedPostEntity = z.infer<typeof FeedPostEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreatePostInputSchema = PostShape.extend({
  content: z.string().max(2000).optional(),

  files: z
    .array(
      CreateFileInputSchema.extend({
        order: z.number().int().max(5).default(1),
        isThumbnail: z.boolean().optional(),
      }),
    )
    .max(5)
    .optional(),

  tags: z.array(z.string().min(1)).max(3).optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export const PostIdInputSchema = z.object({
  postId: z.cuid2(),
});

export type PostIdInput = z.infer<typeof PostIdInputSchema>;

export const LinkPreviewInputSchema = z.object({
  url: z.url(),
});

export type LinkPreviewInput = z.infer<typeof LinkPreviewInputSchema>;

export const ReportPostInputSchema = z.object({
  complaint: z.string().max(200),
});

export type ReportPostInput = z.infer<typeof ReportPostInputSchema>;

export const GetFeedInputSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type GetFeedInput = z.infer<typeof GetFeedInputSchema>;

export const SearchPostInputSchema = z.object({
  queryString: z.string().min(1).max(200),
  cursor: z.string().optional(),
});

export type SearchPostInput = z.infer<typeof SearchPostInputSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const CreatePostOutputSchema = PostEntitySchema;

export type CreatePostOutput = z.infer<typeof CreatePostOutputSchema>;

export const GetPostOutputSchema = PostWithFilesEntitySchema;

export type GetPostOutput = z.infer<typeof GetPostOutputSchema>;

export const LinkPreviewOutputSchema = LinkMetaSchema;

export type LinkPreviewOutput = z.infer<typeof LinkPreviewOutputSchema>;

export const GetFeedOutputSchema = z.object({
  feed: z.array(FeedPostEntitySchema),
  nextCursor: z.string().optional(),
});

export type GetFeedOutput = z.infer<typeof GetFeedOutputSchema>;

export const SearchPostOutputSchema = z.object({
  posts: z.array(FeedPostEntitySchema),
  nextCursor: z.string().optional(),
});

export type SearchPostOutput = z.infer<typeof SearchPostOutputSchema>;

/**
 * --------------------------------
 * ANALYTICS
 * --------------------------------
 */

const AnalyticsChartItemSchema = z.object({
  x: z.string(),
  y: z.number(),
});

export const PostAnalyticsOutputSchema = z.object({
  awareness: z.object({
    reach: z.number(),
    impressions: z.number(),
    visitors: z.number(),
    newFollowers: z.number(),
  }),

  engagement: z.object({
    rate: z.number(),
    likes: z.number(),
    comments: z.number(),
    linkCopied: z.number(),
    bookmarks: z.number(),
    tagsClicked: z.array(AnalyticsChartItemSchema),
    platformShares: z.array(AnalyticsChartItemSchema),
  }),

  behavior: z.object({
    viralityScore: z.number(),
    frictionRatio: z.number(),
    consumptionDepth: z.number(),
    sentiment: z.object({
      positive: z.number(),
      negative: z.number(),
      score: z.number(),
      reports: z.number(),
      notInterested: z.number(),
      status: z.enum(["Healthy", "Polarizing"]),
    }),
  }),
});

export type PostAnalyticsOutput = z.infer<typeof PostAnalyticsOutputSchema>;

/**
 * --------------------------------
 * SEARCH DOCUMENT
 * --------------------------------
 */

export const PostSearchDocumentSchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),

    parentId: z.cuid2().nullable(),
    parentType: z.enum(ACTIVITY_PARENT_TYPES),

    creatorUsername: z.string().nullable(),
    creatorFullName: z.string().nullable(),
    creatorImageUrl: z.string().nullable(),

    tagIds: z.array(z.number()),
    tagNames: z.array(z.string()),

    badge: z.enum(POST_BADGE_TYPES).nullable(),
    postType: z.enum(POST_TYPES),

    content: z.string().nullable(),

    linkTitle: z.string().nullable(),
    linkDescription: z.string().nullable(),
    linkUrl: z.url().nullable(),
    linkImage: z.url().nullable(),

    files: z.array(FileEntitySchema).nullable(),

    mentions: z.array(z.cuid2()).max(15).optional(),

    createdAt: z.iso.datetime().nullable(),
  })
  .openapi("PostSearchDocument");

export type PostSearchDocument = z.infer<typeof PostSearchDocumentSchema>;
