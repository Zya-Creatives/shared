import { z } from "@hono/zod-openapi";

import { ACTIVITY_PARENT_TYPES, MESSAGE_TYPES } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const MessageShape = z.object({
  chatId: z.cuid2(),
  content: z.string().optional(),
  messageType: z.enum(MESSAGE_TYPES).default("DEFAULT_MESSAGE"),

  parentId: z.cuid2().optional(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).optional(),

  replyToMessageId: z.cuid2().optional(),

  linkMeta: z
    .object({
      url: z.url(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.url().optional(),
    })
    .optional(),
});

export type MessageShapeType = z.infer<typeof MessageShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const MessageEntitySchema = z
  .object({
    id: z.cuid2(),
    senderId: z.cuid2(),
    receiverId: z.cuid2(),

    ...MessageShape.shape,

    replyToContent: z.string().optional(),
    replyToImages: z.array(z.url()).optional(),
    replyToLinkMeta: MessageShape.shape.linkMeta,
    
    deletedBySender: z.boolean().default(false),
    deletedByReceiver: z.boolean().default(false),
    isEdited: z.boolean().default(false),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime().optional(),
    deletedAt: z.iso.datetime().optional(),
  })
  .openapi("Message");

export type MessageEntity = z.infer<typeof MessageEntitySchema>;

export const MessageFileEntitySchema = z.object({
  id: z.cuid2(),
  messageId: z.cuid2(),
  fileId: z.cuid2(),
  url: z.url(),
  order: z.int(),
});

export type MessageFileEntity = z.infer<typeof MessageFileEntitySchema>;

export const MessageWithFilesEntitySchema = MessageEntitySchema.extend({
  messageFiles: z.array(MessageFileEntitySchema),
});

export type MessageWithFilesEntity = z.infer<
  typeof MessageWithFilesEntitySchema
>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateMessageInputSchema = MessageShape.extend({
  receiverId: z.cuid2(),
  files: z
    .array(
      z.object({
        key: z.string(),
        mimeType: z.string(),
        order: z.int(),
      }),
    )
    .optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;

export const EditMessageInputSchema = z.object({
  messageId: z.cuid2(),
  content: z.string().optional(),
});

export type EditMessageInput = z.infer<typeof EditMessageInputSchema>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const GetMessagesOutputSchema = z.object({
  messages: z.array(MessageWithFilesEntitySchema),
  nextCursor: z.string().optional(),
});

export type GetMessagesOutput = z.infer<typeof GetMessagesOutputSchema>;
