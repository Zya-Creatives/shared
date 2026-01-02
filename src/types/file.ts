import { z } from "@hono/zod-openapi";
import {
  CreateFileInputSchema,
  CreateFileOutputSchema,
  DeleteFileInputSchema,
  DeleteFileOutputSchema,
  FileEntitySchema,
  FileKeySchema,
  FileUpdateInputSchema,
  GetPresignedDownloadUrlInputSchema,
  GetPresignedDownloadUrlOutputSchema,
  GetPresignedUploadUrlInputSchema,
  GetPresignedUploadUrlOutputSchema,
} from "../schemas/file";

export type FileEntity = z.infer<typeof FileEntitySchema>;

export type CreateFileInput = z.infer<typeof CreateFileInputSchema>;
export type CreateFileOutput = z.infer<typeof CreateFileOutputSchema>;

export type FileUpdateEntity = z.infer<typeof FileUpdateInputSchema>;

export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;
export type DeleteFileOutput = z.infer<typeof DeleteFileOutputSchema>;

export type FileKeyInput = z.infer<typeof FileKeySchema>;
export type GetPresignedUploadUrlInput = z.infer<
  typeof GetPresignedUploadUrlInputSchema
>;
export type GetPresignedUploadUrlOutput = z.infer<
  typeof GetPresignedUploadUrlOutputSchema
>;

export type GetPresignedDownloadUrlInput = z.infer<
  typeof GetPresignedDownloadUrlInputSchema
>;
export type GetPresignedDownloadUrlOutput = z.infer<
  typeof GetPresignedDownloadUrlOutputSchema
>;
