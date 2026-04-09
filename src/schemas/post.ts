import { z } from "@hono/zod-openapi";
import {
  ACTIVITY_PARENT_TYPES,
  POST_BADGE_TYPES,
  POST_TYPES,
} from "../constants";
import { FileEntitySchema, CreateFileInputSchema } from "./file";
import { CommentEntitySchema } from "./comment";
import { EntityStatsSchema } from "./entity-stats";
import { ActivitySchema } from "./activity";
import { cleanHtml } from "../utils/clean-html";

export const PostEntitySchema = z.object({
  id: z
    .cuid2()
    .openapi({ description: "Post id", example: "ckj1a2b3c0000xyz" }),
  parentId: z
    .cuid2()
    .optional()
    .openapi({ description: "Parent id", example: "ckj1a2b3c0000abc" }),
  parentType: z
    .enum(ACTIVITY_PARENT_TYPES)
    .default(ACTIVITY_PARENT_TYPES.POST)
    .openapi({ example: "POST" }),
  tags: z
    .array(
      z.object({
        name: z.string().openapi({ example: "javascript" }),
        id: z.int().openapi({ example: 101 }),
      }),
    )
    .optional()
    .openapi({ example: [{ name: "javascript", id: 101 }] }),
  mentions: z
    .array(z.string())
    .optional()
    .openapi({ example: ["cuid123", "cuid456"] }),
  badge: z.enum(POST_BADGE_TYPES).optional().openapi({ example: "FEATURED" }),
  userId: z
    .cuid2()
    .openapi({ description: "User id", example: "ckj1a2b3c0000def" }),
  creatorUsername: z
    .string()
    .optional()
    .openapi({ description: "Username", example: "dev_guru" }),
  creatorFullName: z.string().optional().openapi({ example: "Jane Doe" }),
  creatorImageUrl: z
    .cuid2()
    .optional()
    .openapi({ description: "Creator Image ID", example: "clm1a2b3c0000pic" }),
  content: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const plainText = cleanHtml(val, Number.MAX_SAFE_INTEGER);
        return plainText.length <= 300;
      },
      { message: "Post content cannot exceed 300 characters" },
    )
    .openapi({ example: "Check out my new portfolio update!" }),
  postType: z.enum(POST_TYPES).openapi({
    description: "Type of the post entity",
    title: "Post Type",
    example: "PROJECT",
  }),
  createdAt: z.coerce
    .date()
    .optional()
    .openapi({ example: "2026-03-11T14:43:09Z" }),
  linkMeta: z
    .object({
      url: z.url().openapi({ example: "https://example.com" }),
      title: z.string().optional().openapi({ example: "Example Website" }),
      description: z
        .string()
        .optional()
        .openapi({ example: "This is an example link" }),
      image: z
        .url()
        .optional()
        .openapi({ example: "https://example.com/preview.jpg" }),
    })
    .optional()
    .openapi({
      description: "Optional metadata for a single link in the post",
    }),
});
export type PostEntity = z.infer<typeof PostEntitySchema>;

export const PostWithFilesEntitySchema = PostEntitySchema.extend({
  files: z
    .array(FileEntitySchema)
    .optional()
    .openapi({ description: "Files attached to the post", example: [] }),
});
export type PostWithFilesEntity = z.infer<typeof PostWithFilesEntitySchema>;

export const MinimalPostSchema = PostEntitySchema.pick({
  id: true,
  parentId: true,
  content: true,
});

export const FeedPostEntitySchema = PostWithFilesEntitySchema.extend({
  stats: EntityStatsSchema,
  score: z.number().openapi({ example: 98.5 }),
  isLiked: z.boolean().optional().openapi({ example: true }),
  isFollowing: z.boolean().optional().openapi({ example: false }),
  isBookmarked: z.boolean().optional().openapi({ example: false }),
});
export type FeedPostEntity = z.infer<typeof FeedPostEntitySchema>;

export const CreatePostInputSchema = z.object({
  id: z.cuid2().openapi({ example: "ckj1a2b3c0000xyz" }),
  parentId: z
    .cuid2({ message: "Invalid parentId" })
    .optional()
    .openapi({ description: "Parent id", example: "ckl1a2b3c0000abc" }),
  parentType: z
    .enum(ACTIVITY_PARENT_TYPES)
    .default(ACTIVITY_PARENT_TYPES.POST)
    .openapi({ example: "POST" }),
  content: z
    .string()
    .max(2000, { message: "Post content cannot exceed 2000 characters" })
    .optional()
    .openapi({
      description: "Post content",
      example: "New project announcement",
    }),
  postType: z
    .enum(POST_TYPES)
    .default("DEFAULT_POST")
    .openapi({ description: "Post type", example: "PROJECT" }),
  files: z
    .array(
      CreateFileInputSchema.extend({
        order: z
          .number()
          .int({ message: "File order must be an integer" })
          .max(5, { message: "File order cannot exceed 5" })
          .default(1)
          .openapi({ example: 1 }),
        isThumbnail: z.boolean().optional().openapi({ example: false }),
      }),
    )
    .max(5, { message: "Cannot attach more than 5 files" })
    .optional()
    .openapi({
      example: [
        {
          key: "uploads/img.png",
          mimeType: "image/png",
          order: 1,
          isThumbnail: false,
        },
      ],
    }),
  tags: z
    .array(z.string().min(1, { message: "Tag cannot be empty" }))
    .max(3, { message: "Cannot add more than 3 tags" })
    .optional()
    .openapi({ example: ["react", "frontend"] }),
  mentions: z
    .array(z.cuid2())
    .max(15, { message: "Cannot mention more than 15 users" })
    .optional()
    .openapi({ example: ["cuid123"] }),
  badge: z.enum(POST_BADGE_TYPES).optional().openapi({ example: "TRENDING" }),
  linkMeta: z
    .object({
      url: z
        .url({ message: "Invalid URL format" })
        .openapi({ example: "https://example.com" }),
      title: z
        .string()
        .max(200, { message: "Title cannot exceed 200 characters" })
        .optional()
        .openapi({ example: "Example Website" }),
      description: z
        .string()
        .max(500, { message: "Description cannot exceed 500 characters" })
        .optional()
        .openapi({ example: "This is an example link" }),
      image: z
        .string({ message: "" })
        .optional()
        .openapi({ example: "https://example.com/preview.jpg" }),
    })
    .optional()
    .openapi({
      description: "Optional metadata for a single link in the post",
    }),
});
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export const PostIdSchema = z.object({
  postId: z.cuid2().openapi({ example: "ckj1a2b3c0000xyz" }),
});
export type PostIdInput = z.infer<typeof PostIdSchema>;
export const LinkPreviewInputSchema = z.object({
  url: z.url().openapi({ example: "https://example.com/article" }),
});
export type LinkPreviewInput = z.infer<typeof LinkPreviewInputSchema>;
export const ReportPostInputSchema = z.object({
  complaint: z
    .string()
    .max(200, { error: "Complaint cannot be longer than 200 characters" })
    .openapi({ example: "This post contains spam." }),
});
export type ReportPostInput = z.infer<typeof ReportPostInputSchema>;
export const GetFeedInputSchema = z.object({
  limit: z.number().int().optional().openapi({ example: 20 }),
  cursor: z.string().optional().openapi({ example: "ckj1a2b3c0000cur" }),
});
export type GetFeedInput = z.infer<typeof GetFeedInputSchema>;
export const SearchPostInputSchema = z.object({
  queryString: z
    .string()
    .min(1, { message: "Search string cannot be empty" })
    .max(200, { message: "Search string cannot exceed 200 characters" })
    .openapi({ example: "typescript utility types" }),
  cursor: z.string().optional().openapi({ example: "ckj1a2b3c0000cur" }),
});
export type SearchPostInput = z.infer<typeof SearchPostInputSchema>;

export const CreatePostOutputSchema = PostEntitySchema;
export type CreatePostOutput = z.infer<typeof CreatePostOutputSchema>;
export const GetPostOutputSchema = PostWithFilesEntitySchema;
export type GetPostOutput = z.infer<typeof GetPostOutputSchema>;
export const LinkPreviewOutputSchema = z.object({
  title: z.string().openapi({ example: "Great Article" }),
  description: z
    .string()
    .optional()
    .openapi({ example: "A detailed breakdown of the topic." }),
  image: z
    .string()
    .optional()
    .openapi({ example: "https://example.com/hero.jpg" }),
  url: z
    .string()
    .optional()
    .openapi({ example: "https://example.com/article" }),
});
export type LinkPreviewOutput = z.infer<typeof LinkPreviewOutputSchema>;
export const GetFeedOutputSchema = z.object({
  feed: z.array(FeedPostEntitySchema).openapi({ example: [] }),
  nextCursor: z
    .string()
    .optional()
    .nullable()
    .openapi({ example: "ckj1a2b3c0000nxt" }),
});
export type GetFeedOutput = z.infer<typeof GetFeedOutputSchema>;
export const SearchPostOutputSchema = z.object({
  posts: z.array(FeedPostEntitySchema).openapi({ example: [] }),
  nextCursor: z
    .string()
    .optional()
    .nullable()
    .openapi({ example: "ckj1a2b3c0000nxt" }),
});
export type SearchPostOutput = z.infer<typeof SearchPostOutputSchema>;

const AnalyticsChartItemSchema = z.object({
  x: z.string().openapi({ example: "2026-03-11" }),
  y: z.number().openapi({ example: 150 }),
});
export const PostAnalyticsOutputSchema = z.object({
  awareness: z.object({
    reach: z.number().openapi({ example: 5000 }),
    impressions: z.number().openapi({ example: 6500 }),
    visitors: z.number().openapi({ example: 1200 }),
    newFollowers: z.number().openapi({ example: 45 }),
  }),
  engagement: z.object({
    rate: z.number().openapi({ example: 4.2 }),
    likes: z.number().openapi({ example: 210 }),
    comments: z.number().openapi({ example: 34 }),
    linkCopied: z.number().openapi({ example: 12 }),
    bookmarks: z.number().openapi({ example: 56 }),
    tagsClicked: z
      .array(AnalyticsChartItemSchema)
      .openapi({ example: [{ x: "javascript", y: 25 }] }),
    platformShares: z
      .array(AnalyticsChartItemSchema)
      .openapi({ example: [{ x: "Twitter", y: 10 }] }),
  }),
  behavior: z.object({
    viralityScore: z.number().openapi({ example: 8.5 }),
    frictionRatio: z.number().openapi({ example: 1.2 }),
    consumptionDepth: z.number().openapi({ example: 65.4 }),
    sentiment: z.object({
      positive: z.number().openapi({ example: 85 }),
      negative: z.number().openapi({ example: 5 }),
      score: z.number().openapi({ example: 9.1 }),
      reports: z.number().openapi({ example: 0 }),
      notInterested: z.number().openapi({ example: 2 }),
      status: z.enum(["Healthy", "Polarizing"]).openapi({ example: "Healthy" }),
    }),
  }),
});
export type PostAnalyticsOutput = z.infer<typeof PostAnalyticsOutputSchema>;

export const PostSearchDocumentSchema = z
  .object({
    id: z.cuid2().openapi({ example: "ckj1a2b3c0000doc" }),
    userId: z.cuid2().openapi({ example: "ckj1a2b3c0000usr" }),
    parentId: z.cuid2().nullable().openapi({ example: "ckj1a2b3c0000prt" }),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).openapi({ example: "POST" }),
    creatorUsername: z.string().nullable().openapi({ example: "tech_lead" }),
    creatorFullName: z.string().nullable().openapi({ example: "Alex Smith" }),
    creatorImageUrl: z
      .cuid2()
      .nullable()
      .openapi({ example: "clm1a2b3c0000pic" }),
    tagIds: z.array(z.number()).openapi({ example: [101, 102] }),
    tagNames: z.array(z.string()).openapi({ example: ["react", "typescript"] }),
    badge: z.enum(POST_BADGE_TYPES).nullable().openapi({ example: "TRENDING" }),
    postType: z.enum(POST_TYPES).openapi({ example: "PROJECT" }),
    content: z
      .string()
      .nullable()
      .openapi({ example: "Here is my latest open source tool." }),
    linkTitle: z.string().nullable().openapi({ example: "GitHub Repo" }),
    linkDescription: z
      .string()
      .nullable()
      .openapi({ example: "A fast, modern build system." }),
    linkUrl: z
      .url()
      .nullable()
      .openapi({ example: "https://github.com/project" }),
    linkImage: z
      .url()
      .nullable()
      .openapi({ example: "https://github.com/image.png" }),
    files: z.array(FileEntitySchema).nullable().openapi({ example: [] }),
    mentions: z
      .array(z.cuid2())
      .max(15, { message: "Cannot mention more than 15 users" })
      .optional()
      .openapi({ example: ["cuid123"] }),
    createdAt: z
      .string()
      .nullable()
      .openapi({ example: "2026-03-11T14:43:09.000Z" }),
  })
  .openapi({
    title: "Post Search Document",
    description: "Flattened schema used for indexing posts in search engines.",
  });
export type PostSearchDocument = z.infer<typeof PostSearchDocumentSchema>;
