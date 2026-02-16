import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES, MESSAGE_TYPES } from "../constants";
import { CreateFileInputSchema } from "./file";

// 1. Base primitives
export const LinkMetaSchema = z.object({
  url: z.url(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.url().optional(),
});

// 2. The API Output Schema (Enriched)
export const MessageEntitySchema = z.object({
  id: z.cuid2(),
  chatId: z.cuid2(),
  senderId: z.cuid2(),
  receiverId: z.cuid2(),

  // Content & Type
  content: z.string().optional().default(""),
  messageType: z.enum(MESSAGE_TYPES).default("DEFAULT_MESSAGE"),

  // Parent/Threading
  parentId: z.cuid2().optional(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).optional(),

  // Reply Context
  replyToMessageId: z.cuid2().optional(),
  replyToContent: z.string().optional(),
  replyToImages: z.array(z.url()).optional(),
  replyToLinkMeta: LinkMetaSchema.optional(),

  // Metadata
  linkMeta: LinkMetaSchema.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
});

export const MessageFileEntitySchema = z.object({
  id: z.cuid2(),
  messageId: z.cuid2(),
  fileId: z.cuid2(),
  url: z.url(),
  order: z.number().int().default(0),
});

export const MessageWithFilesEntitySchema = MessageEntitySchema.extend({
  messageFiles: z.array(MessageFileEntitySchema).default([]),
});

// 3. Inputs
export const CreateMessageInputSchema = z.object({
  id: z.cuid2(),
  chatId: z.cuid2(),
  senderId: z.cuid2(),
  receiverId: z.cuid2(),

  content: z.string().optional(),
  messageType: z.enum(MESSAGE_TYPES).default("DEFAULT_MESSAGE"),

  parentId: z.cuid2().optional(),
  replyToMessageId: z.cuid2().optional(),

  linkMeta: LinkMetaSchema.optional(),
  files: z
    .array(CreateFileInputSchema.extend({ order: z.number().int() }))
    .optional(),
});

export const GetMessagesOutputSchema = z.object({
  messages: z.array(MessageWithFilesEntitySchema),
  nextCursor: z.string().nullable(),
});

export const MessageIdSchema = z.object({
  messageId: z.cuid2(),
});

export const ChatIdParamSchema = z.object({
  chatId: z.cuid2(),
});
