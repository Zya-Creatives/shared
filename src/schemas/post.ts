import { z } from "@hono/zod-openapi";
import {
  ACTIVITY_PARENT_TYPES,
  POST_BADGE_TYPES,
  POST_TYPES,
} from "../constants";
import { CreateFileInputSchema } from "./file";
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
    .openapi({
      example: [{ name: "javascript", id: 101 }],
    }),
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
      {
        message: "Post content cannot exceed 300 characters",
      },
    )
    .openapi({ example: "Check out my new portfolio update!" }),
  postType: z.enum(POST_TYPES).openapi({
    description: "Type of the post entity this statistic belongs to.",
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
      example: {
        url: "https://example.com",
        title: "Example Website",
        description: "This is an example link",
        image: "https://example.com/preview.jpg",
      },
    }),
});

export const PostFileEntitySchema = z
  .object({
    id: z
      .cuid2()
      .openapi({
        description: "CUID2 of the project file record.",
        example: "cxy1a2b3c0000qwe",
      }),
    postId: z.cuid2().openapi({
      description: "CUID2 of the post this file belongs to.",
      example: "ckj1a2b3c0000xyz",
    }),
    fileId: z.cuid2().openapi({
      description: "CUID2 of the linked file.",
      example: "cvb1a2b3c0000rty",
    }),
    order: z.number().int().openapi({
      description: "Order index of the file in the project.",
      example: 1,
    }),
  })
  .openapi({
    title: "Post File Entity",
    description: "Schema representing a file associated with a project.",
  });

export const PostWithFilesEntitySchema = PostEntitySchema.extend({
  postFiles: z
    .array(
      PostFileEntitySchema.extend({
        url: z.url().openapi({ example: "https://cdn.example.com/image.png" }),
      }),
    )
    .optional()
    .openapi({
      description: "Files associated with the project.",
      example: [
        {
          id: "cxy1a2b3c0000qwe",
          postId: "ckj1a2b3c0000xyz",
          fileId: "cvb1a2b3c0000rty",
          order: 1,
          url: "https://cdn.example.com/image.png",
        },
      ],
    }),
});

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
    .max(300, { message: "Post content cannot exceed 300 characters" })
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
      }),
    )
    .max(5, { message: "Cannot attach more than 5 files" })
    .optional()
    .openapi({
      example: [{ fileId: "cvb1a2b3c0000rty", order: 1 }],
    }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag cannot be empty" })
        .openapi({ example: "react" }),
    )
    .max(3, { message: "Cannot add more than 3 tags" })
    .optional()
    .openapi({ example: ["react", "frontend"] }),
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
        .max(500, {
          message: "Description cannot exceed 500 characters",
        })
        .optional()
        .openapi({ example: "This is an example link" }),
      image: z
        .url({ message: "Invalid image URL" })
        .optional()
        .openapi({ example: "https://example.com/preview.jpg" }),
    })
    .optional()
    .openapi({
      description: "Optional metadata for a single link in the post",
      example: {
        url: "https://example.com",
        title: "Example Website",
        description: "This is an example link",
        image: "https://example.com/preview.jpg",
      },
    }),
});

export const CreatePostOutputSchema = PostEntitySchema;
export const GetPostOutputSchema = PostWithFilesEntitySchema;
export const PostIdSchema = z.object({
  postId: z.cuid2().openapi({ example: "ckj1a2b3c0000xyz" }),
});

export const MinimalPostSchema = PostEntitySchema.pick({
  id: true,
  parentId: true,
  content: true,
});

export const PostWithLikesEntitySchema = MinimalPostSchema.extend({
  likes: z
    .array(
      ActivitySchema.extend({
        followsYou: z.boolean().optional().openapi({ example: true }),
        isFollowing: z.boolean().optional().openapi({ example: false }),
      }),
    )
    .openapi({ example: [] }),
}).openapi({
  title: "PostWithPostLikesEntity",
});

export const GetPostWithLikesOutputSchema = PostWithLikesEntitySchema.extend({
  nextCursor: z
    .string()
    .optional()
    .nullable()
    .openapi({ example: "ckj1a2b3c0000nxt" }),
});

export const PostWithCommentsEntitySchema = MinimalPostSchema.extend({
  comments: z.array(CommentEntitySchema).openapi({ example: [] }),
}).openapi({
  title: "PostWithPostCommentsEntity",
});

export const GetPostWithCommentsOutputSchema =
  PostWithCommentsEntitySchema.extend({
    nextCursor: z
      .string()
      .optional()
      .nullable()
      .openapi({ example: "ckj1a2b3c0000nxt" }),
  });

export const PostWithBookmarksEntitySchema = MinimalPostSchema.extend({
  bookmarks: z.array(ActivitySchema).openapi({ example: [] }),
}).openapi({
  title: "PostWithPostBookmarksEntity",
});

export const GetPostWithBookmarksOutputSchema =
  PostWithBookmarksEntitySchema.extend({
    totalNo: z.number().int().openapi({ example: 42 }),
  });

export const LinkPreviewInputSchema = z.object({
  url: z.url().openapi({ example: "https://example.com/article" }),
});

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

export const FeedPostEntitySchema = PostWithFilesEntitySchema.extend({
  stats: EntityStatsSchema,
  score: z.number().openapi({ example: 98.5 }),
  isLiked: z.boolean().optional().openapi({ example: true }),
  isFollowing: z.boolean().optional().openapi({ example: false }),
  isBookmarked: z.boolean().optional().openapi({ example: false }),
});

export const GetFeedInputSchema = z.object({
  limit: z.number().int().optional().openapi({ example: 20 }),
  cursor: z.string().optional().openapi({ example: "ckj1a2b3c0000cur" }),
});

export const GetFeedOutputSchema = z.object({
  feed: z.array(FeedPostEntitySchema).openapi({ example: [] }),
  nextCursor: z
    .string()
    .optional()
    .nullable()
    .openapi({ example: "ckj1a2b3c0000nxt" }),
});

export const SearchPostInputSchema = z.object({
  queryString: z
    .string()
    .min(1, { message: "Search string cannot be empty" })
    .max(200, { message: "Search string cannot exceed 200 characters" })
    .openapi({ example: "typescript utility types" }),
  cursor: z.string().optional().openapi({ example: "ckj1a2b3c0000cur" }),
});

export const SearchPostOutputSchema = z.object({
  posts: z.array(FeedPostEntitySchema).openapi({ example: [] }),
  nextCursor: z
    .string()
    .optional()
    .nullable()
    .openapi({ example: "ckj1a2b3c0000nxt" }),
});

export const ReportPostInputSchema = z.object({
  complaint: z
    .string()
    .max(200, { error: "Complaint cannot be longer than 200 characters" })
    .openapi({ example: "This post contains spam." }),
});

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
    postFiles: z
      .array(
        PostFileEntitySchema.extend({
          url: z
            .url()
            .openapi({ example: "https://cdn.example.com/file1.png" }),
        }),
      )
      .nullable()
      .openapi({
        example: [
          {
            id: "cxy1a2b3c0000qwe",
            postId: "ckj1a2b3c0000doc",
            fileId: "cvb1a2b3c0000rty",
            order: 1,
            url: "https://cdn.example.com/file1.png",
          },
        ],
      }),
    createdAt: z
      .string()
      .nullable()
      .openapi({ example: "2026-03-11T14:43:09.000Z" }),
  })
  .openapi({
    title: "Post Search Document",
    description: "Flattened schema used for indexing posts in search engines.",
  });
