import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES, MESSAGE_TYPES } from "../constants";
import { CreateFileInputSchema } from "./file";

export const MessageEntitySchema = z.object({
  id: z.cuid2(),
  parentId: z.cuid2().optional(),
  parentType: z.enum(ACTIVITY_PARENT_TYPES).optional(),
  replyToMessageId: z.cuid2().optional(),
  chatId: z.cuid2(),
  senderId: z.cuid2(),
  linkMeta: z
    .object({
      url: z.url(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.url().optional(),
    })
    .optional(),
  content: z.string().optional(),
  messageType: z.enum(MESSAGE_TYPES).default(MESSAGE_TYPES.DEFAULT_MESSAGE),
  replyToContent: z.string().optional(),
  replyToImages: z.array(z.url()).optional(),
  replyToLinkMeta: z
    .object({
      url: z.url(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.url().optional(),
    })
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
});

export const MessageFileEntitySchema = z
  .object({
    id: z
      .string()
      .openapi({ description: "CUID2 of the project file record." }),
    messageId: z.string().openapi({
      description: "CUID2 of the message this file belongs to.",
    }),
    fileId: z.string().openapi({ description: "CUID2 of the linked file." }),
    order: z.number().int().openapi({
      description: "Order index of the file in the project.",
      example: 1,
    }),
  })
  .openapi({
    title: "Message File Entity",
    description: "Schema representing a file associated with a project.",
  });

export const MessageWithFilesEntitySchema = MessageEntitySchema.extend({
  messageFiles: z
    .array(
      MessageFileEntitySchema.extend({
        url: z.url(),
      }),
    )
    .optional()
    .openapi({ description: "Files associated with the project." }),
});

export const CreateMessageInputSchema = z.object({
  parentId: z
    .cuid2()
    .optional()
    .openapi({ description: "Parent id", example: "ckl1a2b3c0000abc" }),
  content: z
    .string()
    .openapi({
      description: "Message content",
      example: "New project announcement",
    })
    .optional(),
  messageType: z
    .enum(MESSAGE_TYPES)
    .default("DEFAULT_MESSAGE")
    .openapi({ description: "Message type", example: "PROJECT" }),
  files: z
    .array(
      CreateFileInputSchema.extend({
        order: z.int().default(1),
      }),
    )
    .optional(),
  chatId: z.string(),
  senderId: z.string(),
  replyToMessageId: z.cuid2().optional(),
  linkMeta: z
    .object({
      url: z.url(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.url().optional(),
    })
    .optional()
    .openapi({
      description: "Optional metadata for a single link in the message",
      example: {
        url: "https://example.com",
        title: "Example Website",
        description: "This is an example link",
        image: "https://example.com/preview.jpg",
      },
    }),
});

export const CreateMessageOutputSchema = MessageEntitySchema;

export const GetMessagesOutputSchema = z.array(MessageFileEntitySchema);
