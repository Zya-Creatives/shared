import { z } from "@hono/zod-openapi";

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
