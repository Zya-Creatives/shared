import { z } from "@hono/zod-openapi";

import { MESSAGE_REQUEST_STATUS } from "../constants";

/**
 * --------------------------------
 * SHAPE
 * --------------------------------
 */

const ChatShape = z.object({
  senderId: z.cuid2(),
  receiverId: z.cuid2(),
  isMessageRequest: z.boolean().default(true),
  messageRequestStatus: z.enum(MESSAGE_REQUEST_STATUS).default("PENDING"),
});

export type ChatShapeType = z.infer<typeof ChatShape>;

/**
 * --------------------------------
 * BASE ENTITY
 * --------------------------------
 */

export const BaseChatEntitySchema = z
  .object({
    id: z.cuid2(),
    ...ChatShape.shape,
    acceptedAt: z.iso.datetime().nullable(),
    declinedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime().nullable(),
    deletedAt: z.iso.datetime().nullable(),
  })
  .openapi("BaseChat");

export type BaseChatEntity = z.infer<typeof BaseChatEntitySchema>;

/**
 * --------------------------------
 * DERIVED ENTITIES
 * --------------------------------
 */

export const ChatEntitySchema = BaseChatEntitySchema.extend({
  senderName: z.string(),
  senderUsername: z.string(),
  senderImgUrl: z.string().nullable(),

  receiverName: z.string(),
  receiverUsername: z.string(),
  receiverImgUrl: z.string().nullable(),

  lastMessageSent: z.string().nullable(),
  lastMessageAt: z.iso.datetime().nullable(),
  isUnread: z.boolean().default(false),
  isOnline: z.boolean().default(false),
}).openapi("Chat");

export type ChatEntity = z.infer<typeof ChatEntitySchema>;

/**
 * --------------------------------
 * INPUTS
 * --------------------------------
 */

export const CreateChatInputSchema = z.object({
  receiverId: z.cuid2(),
});

export type CreateChatInput = z.infer<typeof CreateChatInputSchema>;

export const ChatIdInputSchema = z.object({
  chatId: z.cuid2(),
});

export type ChatIdInput = z.infer<typeof ChatIdInputSchema>;

export const AcceptMessageRequestInputSchema = ChatIdInputSchema.extend({});

export type AcceptMessageRequestInput = z.infer<
  typeof AcceptMessageRequestInputSchema
>;

export const DeclineMessageRequestInputSchema = ChatIdInputSchema.extend({});

export type DeclineMessageRequestInput = z.infer<
  typeof DeclineMessageRequestInputSchema
>;

/**
 * --------------------------------
 * OUTPUTS
 * --------------------------------
 */

export const CreateChatOutputSchema = BaseChatEntitySchema;

export type CreateChatOutput = z.infer<typeof CreateChatOutputSchema>;

export const GetChatsOutputSchema = z.array(ChatEntitySchema);

export type GetChatsOutput = z.infer<typeof GetChatsOutputSchema>;

export const GetChatsForUserOutputSchema = z.object({
  chats: z.array(ChatEntitySchema),
  nextCursor: z.string().nullable(),
});

export type GetChatsForUserOutput = z.infer<typeof GetChatsForUserOutputSchema>;

export const GetMessageRequestsForUserOutputSchema =
  GetChatsForUserOutputSchema;

export type GetMessageRequestsForUserOutput = z.infer<
  typeof GetMessageRequestsForUserOutputSchema
>;

export const ReportChatInputSchema = z.object({
  complaint: z.string().trim().min(10).max(1000),
  messageId: z.cuid2().optional(),
});

export type ReportChatInput = z.infer<typeof ReportChatInputSchema>;

export const ReportChatOutputSchema = z.object({
  reported: z.boolean(),
  chatId: z.string(),
  messageId: z.string().nullable(),
});

export type ReportChatOutput = z.infer<typeof ReportChatOutputSchema>;

export const ChatListQuerySchema = z.object({
  cursor: z.string().optional(),
  query: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ChatListQuery = z.infer<typeof ChatListQuerySchema>;
