import { z } from "@hono/zod-openapi";

export const FileEntitySchema = z
  .object({
    id: z.cuid2().openapi({ example: "f123e4567-e89b-12d3-a456-426614174000" }),
    key: z.string().openapi({ example: "profile-pic-12345" }),
    mimeType: z.string().openapi({ example: "image/jpeg" }),
    url: z
      .url()
      .optional()
      .openapi({ example: "https://example.com/file.jpg" }),
    userId: z
      .cuid2()
      .openapi({ example: "u123e4567-e89b-12d3-a456-426614174000" }),
    createdAt: z.coerce.date().openapi({ example: "2025-10-14T08:00:00.000Z" }),
    updatedAt: z.coerce.date().openapi({ example: "2025-10-14T09:00:00.000Z" }),
  })
  .openapi({ title: "FileEntity" });

export const FileUpdateInputSchema = z
  .object({
    id: z
      .string()
      .openapi({ example: "f123e4567-e89b-12d3-a456-426614174000" }),
  })
  .openapi({ title: "FileUpdateInput" });

export const CreateFileInputSchema = z.object({
  key: z.string().openapi({ example: "uploads/audio/podcast789.mp3" }),
  mimeType: z.string().openapi({ example: "audio/mpeg" }),
});

export const CreateFileOutputSchema = FileEntitySchema;

export const DeleteFileInputSchema = z.object({
  fileId: z.cuid2().optional().openapi({ example: "0irjif0qur09481u90r1u" }),
  key: z.cuid2().optional(),
});

export const DeleteFileOutputSchema = z.object({
  id: z.cuid2().openapi({ example: "r90rjnaneifijhi31" }),
});

export const GetPresignedUploadUrlInputSchema = z.object({
  key: z.string().openapi({ example: "/users/123/pfp" }),
});

export const GetPresignedUploadUrlOutputSchema = z.object({
  url: z.url().openapi({ example: "https://www.cloudflare.img" }),
});

export const GetPresignedDownloadUrlInputSchema = z.object({
  fileId: z.cuid2().openapi({ example: "0irjif0qur09481u90r1u" }),
});

export const GetPresignedDownloadUrlOutputSchema =
  GetPresignedUploadUrlOutputSchema;

export const FileKeySchema = z.object({
  key: z.string().max(400, {error: "Key should not be longner than 400 characters"}),
});
