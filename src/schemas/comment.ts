import z from "zod";
import { ACTIVITY_PARENT_TYPES } from "../constants";

export const CommentEntitySchema = z.object({
  id: z.cuid2().openapi({
    description: "The unique CUID2 identifier for the comment.",
    example: "tr4q2k7k0000c7625z2k8ggy",
  }),
  userId: z.cuid2().openapi({
    description: "The CUID2 of the user who created the comment.",
    example: "clq9p8f2z0000c762s7k4g1b",
  }),
  parentId: z.cuid2().openapi({
    description:
      "The CUID2 of the parent entity (e.g., a post or project) this comment belongs to.",
    example: "clq9p8f2z0000c762s7k4g1b",
  }),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).openapi({
    description: "The type of the parent entity this comment is attached to.",
    example: "POST", // Assuming 'POST' is a value in ACTIVITY_PARENT_TYPES
  }),
  content: z.string().openapi({
    description: "The text content of the comment. May contain Markdown.",
    example: "This is a great point! I hadn't considered that perspective.",
  }),
  commenterUsername: z.string().optional(),
  commenterName: z.string().optional(),
  commenterImageUrl: z.string().optional(),
  replyToId: z.cuid2().optional().nullable().openapi({
    description:
      "The ID of the parent comment if this is a reply. Null for top-level comments.",
    example: "tr4q2k7k0000c7625z2k8ggy", // Example of a parent comment's ID
  }),
  createdAt: z.coerce.date().optional().openapi({
    description: "The date and time the comment was created.",
    example: "2023-10-27T10:00:00.000Z",
    format: "date-time",
  }),
  updatedAt: z.coerce.date().optional().openapi({
    description: "The date and time the comment was last updated.",
    example: "2023-10-27T10:05:00.000Z",
    format: "date-time",
  }),
});

export const CommentInputSchema = z
  .object({
    content: z.string(),
    parentCommentId: z.cuid2().optional(),
    replyToId: z.cuid2().optional(),
  })
  .openapi({ title: "Comment on Project" });

export const DeleteCommentInputSchema = z.object({
  commentId: z.cuid2(),
});

export const CommentOutputSchema = CommentEntitySchema;
