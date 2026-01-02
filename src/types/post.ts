import { z } from "@hono/zod-openapi";
import {
  CreatePostInputSchema,
  CreatePostOutputSchema,
  FeedPostEntitySchema,
  GetFeedInputSchema,
  GetFeedOutputSchema,
  GetPostOutputSchema,
  LinkPreviewInputSchema,
  LinkPreviewOutputSchema,
  PostEntitySchema,
  PostFileEntitySchema,
  PostIdSchema,
  PostWithBookmarksEntitySchema,
  PostWithCommentsEntitySchema,
  PostWithFilesEntitySchema,
  PostWithLikesEntitySchema,
  SearchPostInputSchema,
  SearchPostOutputSchema,
} from "../schemas/post";

export type PostEntity = z.infer<typeof PostEntitySchema>;
export type PostFileEntity = z.infer<typeof PostFileEntitySchema>;
export type PostWithFilesEntity = z.infer<typeof PostWithFilesEntitySchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
export type CreatePostOutput = z.infer<typeof CreatePostOutputSchema>;
export type PostWithPostLikesEntity = z.infer<typeof PostWithLikesEntitySchema>;
export type PostWithPostBookmarksEntity = z.infer<
  typeof PostWithBookmarksEntitySchema
>;
export type PostIdInput = z.infer<typeof PostIdSchema>;
export type PostWithPostCommentsEntity = z.infer<
  typeof PostWithCommentsEntitySchema
>;
export type GetPostOutput = z.infer<typeof GetPostOutputSchema>;
export type LinkPreviewInput = z.infer<typeof LinkPreviewInputSchema>;
export type LinkPreviewOutput = z.infer<typeof LinkPreviewOutputSchema>;
export type FeedPostEntity = z.infer<typeof FeedPostEntitySchema>;
export type GetFeedInput = z.infer<typeof GetFeedInputSchema>;
export type GetFeedOutput = z.infer<typeof GetFeedOutputSchema>;

export type SearchPostInput = z.infer<typeof SearchPostInputSchema>;
export type SearchPostOutput = z.infer<typeof SearchPostOutputSchema>;
