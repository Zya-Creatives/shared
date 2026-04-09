import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES } from "../constants";

export const FileEntitySchema = z
  .object({
    id: z.cuid2().openapi({ example: "f123e4567-e89b-12d3-a456-426614174000" }),
    key: z.string().openapi({ example: "profile-pic-12345" }),
    mimeType: z.string().openapi({ example: "image/jpeg" }),
    url: z.url().openapi({ example: "https://example.com/file.jpg" }),
    parentId: z.cuid2().nullable().openapi({ example: "ckj1a2b3c0000xyz" }),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).nullable(),
    isThumbnail: z.boolean().nullable().openapi({ example: false }),
    order: z.number().int().openapi({ example: 0 }),
    createdAt: z.coerce.date().openapi({ example: "2025-10-14T08:00:00.000Z" }),
    updatedAt: z.coerce.date().openapi({ example: "2025-10-14T09:00:00.000Z" }),
    deletedAt: z.coerce.date().nullable().openapi({ example: null }),
  })
  .openapi({ title: "FileEntity" });
export type FileEntity = z.infer<typeof FileEntitySchema>;

// ─── Inputs ───────────────────────────────────────────────────────────────────

export const CreateFileInputSchema = z.object({
  key: z.string().openapi({ example: "uploads/audio/podcast789.mp3" }),
  mimeType: z.string().openapi({ example: "audio/mpeg" }),
  parentId: z.cuid2().optional().openapi({ example: "ckj1a2b3c0000xyz" }),
  parentType: z
    .enum(ACTIVITY_PARENT_TYPES)
    .optional()
    .openapi({ example: "POST" }),
  isThumbnail: z.boolean().optional().openapi({ example: false }),
  order: z.number().int().optional().default(0).openapi({ example: 0 }),
});
export type CreateFileInput = z.infer<typeof CreateFileInputSchema>;

export const FileUpdateInputSchema = z
  .object({
    id: z.cuid2().openapi({ example: "f123e4567-e89b-12d3-a456-426614174000" }),
    parentId: z.cuid2().optional().openapi({ example: "ckj1a2b3c0000xyz" }),
    parentType: z
      .enum(ACTIVITY_PARENT_TYPES)
      .optional()
      .openapi({ example: "POST" }),
    isThumbnail: z.boolean().optional().openapi({ example: false }),
    order: z.number().int().optional().openapi({ example: 1 }),
  })
  .openapi({ title: "FileUpdateInput" });
export type FileUpdateEntity = z.infer<typeof FileUpdateInputSchema>;

export const DeleteFileInputSchema = z.object({
  fileId: z.cuid2().optional().openapi({ example: "0irjif0qur09481u90r1u" }),
  key: z.string().optional(),
});

export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

export const FileKeySchema = z.object({
  key: z
    .string()
    .max(400, { error: "Key should not be longer than 400 characters" }),
});
export type FileKeyInput = z.infer<typeof FileKeySchema>;

// ─── Outputs ──────────────────────────────────────────────────────────────────

export const CreateFileOutputSchema = FileEntitySchema;
export type CreateFileOutput = z.infer<typeof CreateFileOutputSchema>;

export const DeleteFileOutputSchema = z.object({
  id: z.cuid2().openapi({ example: "r90rjnaneifijhi31" }),
});
export type DeleteFileOutput = z.infer<typeof DeleteFileOutputSchema>;

export const GetPresignedUploadUrlInputSchema = z.object({
  key: z.string().openapi({ example: "/users/123/pfp" }),
});
export type GetPresignedUploadUrlInput = z.infer<
  typeof GetPresignedUploadUrlInputSchema
>;

export const GetPresignedUploadUrlOutputSchema = z.object({
  url: z.url().openapi({ example: "https://www.cloudflare.img" }),
});
export type GetPresignedUploadUrlOutput = z.infer<
  typeof GetPresignedUploadUrlOutputSchema
>;

export const GetPresignedDownloadUrlInputSchema = z.object({
  fileId: z.cuid2().openapi({ example: "0irjif0qur09481u90r1u" }),
});
export type GetPresignedDownloadUrlInput = z.infer<
  typeof GetPresignedDownloadUrlInputSchema
>;

export const GetPresignedDownloadUrlOutputSchema =
  GetPresignedUploadUrlOutputSchema;
export type GetPresignedDownloadUrlOutput = z.infer<
  typeof GetPresignedDownloadUrlOutputSchema
>;
