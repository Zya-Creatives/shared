import z from "zod";
import {
  BaseChatEntitySchema,
  ChatEntitySchema,
  ChatIdSchema,
  CreateChatInputSchema,
  CreateChatOutputSchema,
  GetChatsOutputSchema,
} from "../schemas/chat";

export type BaseChatEntity = z.infer<typeof BaseChatEntitySchema>;

export type ChatEntity = z.infer<typeof ChatEntitySchema>;

export type CreateChatInput = z.infer<typeof CreateChatInputSchema>;

export type CreateChatOutput = z.infer<typeof CreateChatOutputSchema>;

export type ChatIdInput = z.infer<typeof ChatIdSchema>;

export type GetChatsOutput = z.infer<typeof GetChatsOutputSchema>;
