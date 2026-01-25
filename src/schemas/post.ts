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

export const PostEntitySchema = z.object({
  id: z
    .cuid2()
    .openapi({ description: "Post id", example: "ckj1a2b3c0000xyz" }),
  parentId: z
    .cuid2()
    .optional()
    .openapi({ description: "Parent id", example: "ckj1a2b3c0000abc" }),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).default(ACTIVITY_PARENT_TYPES.POST),
  tags: z
    .array(
      z.object({
        name: z.string(),
        id: z.int(),
      }),
    )
    .optional(),
  badge: z.enum(POST_BADGE_TYPES).optional(),
  userId: z
    .cuid2()
    .openapi({ description: "User id", example: "ckj1a2b3c0000def" }),
  creatorUsername: z.string().optional().openapi({ description: "Username" }),
  creatorFullName: z.string().optional(),
  creatorImageUrl: z.cuid2().optional().openapi({ description: "Username" }),
  content: z
    .string()
    .optional()
    .openapi({ description: "Post content", example: "Hello world" }),
  postType: z.enum(POST_TYPES).openapi({
    description: "Type of the post entity this statistic belongs to.",
    title: "Post Type",
  }),

  createdAt: z.coerce.date().optional(),

  linkMeta: z
    .object({
      url: z.url(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.url().optional(),
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
      .string()
      .openapi({ description: "CUID2 of the project file record." }),
    postId: z.string().openapi({
      description: "CUID2 of the post this file belongs to.",
    }),
    fileId: z.string().openapi({ description: "CUID2 of the linked file." }),
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
        url: z.url(),
      }),
    )
    .optional()
    .openapi({ description: "Files associated with the project." }),
});

export const CreatePostInputSchema = z.object({
  id: z.cuid2(),
  parentId: z
    .cuid2({ message: "Invalid parentId" })
    .optional()
    .openapi({ description: "Parent id", example: "ckl1a2b3c0000abc" }),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).default(ACTIVITY_PARENT_TYPES.POST),
  content: z
    .string()
    .max(500, { message: "Post content cannot exceed 500 characters" })
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
          .default(1),
      }),
    )
    .max(5, { message: "Cannot attach more than 5 files" })
    .optional(),

  tags: z
    .array(z.string().min(1, { message: "Tag cannot be empty" }))
    .max(3, { message: "Cannot add more than 3 tags" })
    .optional(),
  badge: z.enum(POST_BADGE_TYPES).optional(),
  linkMeta: z
    .object({
      url: z.url({ message: "Invalid URL format" }),
      title: z
        .string()
        .max(200, { message: "Title cannot exceed 200 characters" })
        .optional(),
      description: z
        .string()
        .max(500, {
          message: "Description cannot exceed 500 characters",
        })
        .optional(),
      image: z.url({ message: "Invalid image URL" }).optional(),
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
export const PostIdSchema = z.object({ postId: z.cuid2() });
export const MinimalPostSchema = PostEntitySchema.pick({
  id: true,
  parentId: true,
  content: true,
});

export const PostWithLikesEntitySchema = MinimalPostSchema.extend({
  likes: z.array(
    ActivitySchema.extend({
      followsYou: z.boolean().optional(),
      isFollowing: z.boolean().optional(),
    }),
  ),
}).openapi({
  title: "PostWithPostLikesEntity",
});

export const GetPostWithLikesOutputSchema = PostWithLikesEntitySchema.extend({
  nextCursor: z.string().optional().nullable(),
});

export const PostWithCommentsEntitySchema = MinimalPostSchema.extend({
  comments: z.array(CommentEntitySchema),
}).openapi({
  title: "PostWithPostCommentsEntity",
});

export const GetPostWithCommentsOutputSchema =
  PostWithCommentsEntitySchema.extend({
    nextCursor: z.string().optional().nullable(),
  });

export const PostWithBookmarksEntitySchema = MinimalPostSchema.extend({
  bookmarks: z.array(ActivitySchema),
}).openapi({
  title: "PostWithPostBookmarksEntity",
});

export const GetPostWithBookmarksOutputSchema =
  PostWithBookmarksEntitySchema.extend({
    totalNo: z.number().int(),
  });

export const LinkPreviewInputSchema = z.object({
  url: z.string(),
});

export const LinkPreviewOutputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
});

export const FeedPostEntitySchema = PostWithFilesEntitySchema.extend({
  stats: EntityStatsSchema,
  score: z.number(),
  isLiked: z.boolean().optional(),
  isFollowing: z.boolean().optional(),
  isBookmarked: z.boolean().optional(),
});

export const GetFeedInputSchema = z.object({
  limit: z.number().optional(),
  cursor: z.string().optional(),
});

export const GetFeedOutputSchema = z.object({
  feed: z.array(FeedPostEntitySchema),
  nextCursor: z.string().optional().nullable(),
});

export const SearchPostInputSchema = z.object({
  queryString: z
    .string()
    .min(1, { message: "Search string cannot be empty" })
    .max(200, { message: "Search string cannot exceed 200 characters" }),
  cursor: z.string().optional(),
});

export const SearchPostOutputSchema = z.object({
  posts: z.array(FeedPostEntitySchema),
  nextCursor: z.string().optional().nullable(),
});

export const ReportPostInputSchema = z.object({
  complaint: z
    .string()
    .max(200, { error: "Complaint cannot be longer than 200 characters" }),
});

export const PostAnalyticsOutputSchema = z.object({
  awareness: z.object({
    reach: z.number(),
    impressions: z.number(),
    newFollowers: z.number(),
  }),
  engagement: z.object({
    rate: z.number(),
    likes: z.number(),
    comments: z.number(),
    bookmarks: z.number(),
  }),
  behavior: z.object({
    viralityScore: z.number(),
    frictionRatio: z.number(),
    consumptionDepth: z.number(),
    sentiment: z.object({
      positive: z.number(),
      negative: z.number(),
      status: z.enum(["Healthy", "Polarizing"]),
    }),
  }),
});
