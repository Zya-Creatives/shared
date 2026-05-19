import { z } from "@hono/zod-openapi";

import { ACTIVITY_PARENT_TYPES } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const CommentShape = z.object({
  parentId: z.cuid2(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES),
  content: z.string(),
  parentCommentId: z.cuid2().optional(),
  replyToId: z.cuid2().optional().nullable(),
});

export type CommentShapeType = z.infer<typeof CommentShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const CommentEntitySchema = z
  .object({
    id: z.cuid2(),
    userId: z.cuid2(),
    ...CommentShape.shape,

    commenterUsername: z.string().optional(),
    commenterName: z.string().optional(),
    commenterImageUrl: z.string().optional(),

    isLiked: z.boolean().default(false),
    likesCount: z.int().default(0),
    hasReplies: z.boolean().optional(),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime().optional(),
  })
  .openapi("Comment");

export type CommentEntity = z.infer<typeof CommentEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateCommentInputSchema = z.object({
  content: z.string(),
  parentCommentId: z.cuid2().optional(),
  replyToId: z.cuid2().optional().nullable(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;

export const DeleteCommentInputSchema = z.object({
  commentId: z.cuid2(),
});

export type DeleteCommentInput = z.infer<typeof DeleteCommentInputSchema>;

export const CommentIdInputSchema = z.object({
  commentId: z.cuid2(),
});

export type CommentIdInput = z.infer<typeof CommentIdInputSchema>;

export const ProjectCommentParamsSchema = z.object({
  projectId: z.cuid2(),
  commentId: z.cuid2(),
});

export type ProjectCommentParams = z.infer<
  typeof ProjectCommentParamsSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const CommentOutputSchema = CommentEntitySchema;

export type CommentOutput = z.infer<typeof CommentOutputSchema>;

export const CommentThreadResponseSchema = z.object({
  comments: z.array(CommentEntitySchema),
});

export type CommentThreadResponse = z.infer<
  typeof CommentThreadResponseSchema
>;

export const CommentRepliesOutputSchema = z.object({
  replies: z.array(CommentEntitySchema),
  nextCursor: z.string().nullable(),
});

export type CommentRepliesOutput = z.infer<
  typeof CommentRepliesOutputSchema
>;
