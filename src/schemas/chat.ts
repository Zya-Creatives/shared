import { z } from "@hono/zod-openapi";

export const BaseChatEntitySchema = z.object({
  id: z.cuid2(),
  senderId: z.cuid2(),
  receiverId: z.cuid2(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date(),
});

export const ChatEntitySchema = BaseChatEntitySchema.extend({
  senderImgUrl: z.string().optional(),
  senderName: z.string(),
  receiverImgUrl: z.string().optional(),
  receiverName: z.string(),
  lastMessageSent: z.string().optional(),
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
