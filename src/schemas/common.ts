import { z } from "@hono/zod-openapi";
import { CommentEntitySchema } from "./comment";
import { ActivitySchema } from "./activity";
import { LINK_TYPES } from "../constants";

export const CuidSchema = z.cuid2({ error: "Invalid CUID2 is written." });

export const IdInputSchema = z.object({
  id: z.cuid2(),
});

export type IdInput = z.infer<typeof IdInputSchema>;

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
export type DefaultApiSuccessOutput = ApiSuccessOutput;

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


export const LinkSchema = z.object({
  url: z.url({ message: "Please enter a valid URL" }).or(z.literal("")),
  type: z.enum(LINK_TYPES).default(LINK_TYPES.GENERIC_WEBSITE),
});

export const AchievementSchema = z.object({
  title: z.string().min(1),
  link: z.url().optional(),
  year: z.number().int().optional(),
});

export const WorkExperienceSchema = z.object({
  companyName: z.string().min(1),
  position: z.string().min(1),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  currentlyWorking: z.boolean().default(false),
  description: z.string().default(""),
});

export const WebsiteUrlInputSchema = z
  .string()
  .transform((val) => {
    if (!val) return val;
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    return `https://${val}`;
  })
  .pipe(z.url("Invalid URL").or(z.literal("")))
  .optional();

export type Cursor = {
  id: string;
  createdAt: string;
};
