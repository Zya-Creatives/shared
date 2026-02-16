import { z } from "@hono/zod-openapi";
import { MESSAGE_REQUEST_STATUS } from "../constants";

export const BaseChatEntitySchema = z.object({
  id: z.cuid2(),
  senderId: z.cuid2(),
  receiverId: z.cuid2(),
  isMessageRequest: z.boolean().default(true),
  messageRequestStatus: z.enum(MESSAGE_REQUEST_STATUS).default("PENDING"),
  acceptedAt: z.coerce.date().nullable(),
  declinedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
});

export const ChatEntitySchema = BaseChatEntitySchema.extend({
  senderName: z.string(),
  senderUsername: z.string(),
  senderImgUrl: z.string().nullable(),

  receiverName: z.string(),
  receiverUsername: z.string(),
  receiverImgUrl: z.string().nullable(),

  lastMessageSent: z.string().nullable(),
  lastMessageAt: z.coerce.date().nullable(),
  isUnread: z.boolean().default(false),
  isOnline: z.boolean().default(false),
});

export const CreateChatInputSchema = z.object({
  senderId: z.cuid2(),
  receiverId: z.cuid2(),
});

export const CreateChatOutputSchema = BaseChatEntitySchema;

export const ChatIdSchema = z.object({
  chatId: z.cuid2(),
});

export const GetChatsOutputSchema = z.array(ChatEntitySchema);

export const GetChatsForUserOutputSchema = z.object({
  chats: z.array(ChatEntitySchema),
  nextCursor: z.string().nullable(),
});

export const GetMessageRequestsForUserOutputSchema =
  GetChatsForUserOutputSchema;

export const AcceptMessageRequestInputSchema = z.object({
  chatId: z.cuid2(),
  userId: z.cuid2(),
});

export const DeclineMessageRequestInputSchema = AcceptMessageRequestInputSchema;
