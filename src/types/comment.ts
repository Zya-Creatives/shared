import { z } from "@hono/zod-openapi";
import {
  CommentEntitySchema,
  CommentInputSchema,
  CommentOutputSchema,
} from "../schemas/comment";

export type CommentEntity = z.infer<typeof CommentEntitySchema>;

export type CommentInput = z.infer<typeof CommentInputSchema>;

export type CommentOutput = z.infer<typeof CommentOutputSchema>;
