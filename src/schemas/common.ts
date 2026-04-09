import { z } from "@hono/zod-openapi";
import { CommentEntitySchema } from "./comment";
import { ActivitySchema } from "./activity";

export const CuidSchema = z.cuid2({ error: "Invalid CUID2 is written." });

export const UserIdentifierSchema = z.object({
  by: z.enum(["id", "username"]).optional().default("id"),
});

export type UserIdentifier = z.infer<typeof UserIdentifierSchema>;

export const ProfileIdentifierSchema = z.object({
  by: z.enum(["id", "userId"]).optional().default("id"),
});

export type ProfileIdentifier = z.infer<typeof ProfileIdentifierSchema>;

export const ProjectIdentifierSchema = z.object({
  by: z.enum(["id", "userId"]).optional().default("id"),
});

export type ProjectIdentifier = z.infer<typeof ProjectIdentifierSchema>;

export const DefaultApiSuccessOutputSchema = z.object({
  status: z.literal("success"),
});

export type ApiSuccessOutput = z.infer<typeof DefaultApiSuccessOutputSchema>;

export const EntityCommentsOutputSchema = z.object({
  comments: z.array(CommentEntitySchema),
  nextCursor: z.string().nullable(),
});
export type EntityCommentsOutput = z.infer<typeof EntityCommentsOutputSchema>;

export const EntityLikesOutputSchema = z.object({
  likes: z.array(ActivitySchema),
  nextCursor: z.string().nullable(),
});
export type EntityLikesOutput = z.infer<typeof EntityLikesOutputSchema>;

export const EntityBookmarksOutputSchema = z.object({
  bookmarks: z.array(ActivitySchema),
  nextCursor: z.string().nullable(),
});
export type EntityBookmarksOutput = z.infer<typeof EntityBookmarksOutputSchema>;

export const EntityRepliesOutputSchema = z.object({
  replies: z.array(ActivitySchema),
  nextCursor: z.string().nullable(),
});
export type EntityRepliesOutput = z.infer<typeof EntityRepliesOutputSchema>;
