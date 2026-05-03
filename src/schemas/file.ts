import { z } from "@hono/zod-openapi";

import { ACTIVITY_PARENT_TYPES } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const FileShape = z.object({
  key: z.string(),
  mimeType: z.string(),
  parentId: z.cuid2().nullable(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).nullable(),
  isThumbnail: z.boolean().nullable(),
  order: z.number().int(),
});

export type FileShapeType = z.infer<typeof FileShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const FileEntitySchema = z
  .object({
    id: z.cuid2(),
    url: z.url(),
    ...FileShape.shape,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    deletedAt: z.iso.datetime().nullable(),
  })
  .openapi("File");

export type FileEntity = z.infer<typeof FileEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateFileInputSchema = z.object({
  key: z.string(),
  mimeType: z.string(),
  parentId: z.cuid2().optional(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).optional(),
  isThumbnail: z.boolean().optional(),
  order: z.number().int().default(0),
});

export type CreateFileInput = z.infer<typeof CreateFileInputSchema>;

export const UpdateFileInputSchema = z.object({
  fileId: z.cuid2(),
  parentId: z.cuid2().optional(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).optional(),
  isThumbnail: z.boolean().optional(),
  order: z.number().int().optional(),
});

export type UpdateFileInput = z.infer<typeof UpdateFileInputSchema>;

export const DeleteFileInputSchema = z.object({
  fileId: z.cuid2().optional(),
  key: z.string().optional(),
});

export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

export const FileKeyInputSchema = z.object({
  key: z.string().max(400),
});

export type FileKeyInput = z.infer<typeof FileKeyInputSchema>;

export const GetPresignedUploadUrlInputSchema = z.object({
  key: z.string(),
});

export type GetPresignedUploadUrlInput = z.infer<
  typeof GetPresignedUploadUrlInputSchema
>;

export const GetPresignedDownloadUrlInputSchema = z.object({
  fileId: z.cuid2(),
});

export type GetPresignedDownloadUrlInput = z.infer<
  typeof GetPresignedDownloadUrlInputSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const CreateFileOutputSchema = FileEntitySchema;

export type CreateFileOutput = z.infer<typeof CreateFileOutputSchema>;

export const DeleteFileOutputSchema = z.object({
  id: z.cuid2(),
});

export type DeleteFileOutput = z.infer<typeof DeleteFileOutputSchema>;

export const GetPresignedUploadUrlOutputSchema = z.object({
  url: z.url(),
});

export type GetPresignedUploadUrlOutput = z.infer<
  typeof GetPresignedUploadUrlOutputSchema
>;

export const GetPresignedDownloadUrlOutputSchema =
  GetPresignedUploadUrlOutputSchema;

export type GetPresignedDownloadUrlOutput = z.infer<
  typeof GetPresignedDownloadUrlOutputSchema
>;
