import z from "zod";
import {
  CreateMessageInputSchema,
  DeleteMessagesInputSchema,
  EditMessageInputSchema,
  GetMessagesOutputSchema,
  MessageEntitySchema,
  MessageFileEntitySchema,
  MessageWithFilesEntitySchema,
} from "../schemas/message";

export type MessageEntity = z.infer<typeof MessageEntitySchema>;

export type MessageFileEntity = z.infer<typeof MessageFileEntitySchema>;

export type MessageWithFilesEntity = z.infer<
  typeof MessageWithFilesEntitySchema
>;

export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;

export type GetMessagesOutput = z.infer<typeof GetMessagesOutputSchema>;

export type DeleteMessagesInput = z.infer<typeof DeleteMessagesInputSchema>;

export type EditMessageInput = z.infer<typeof EditMessageInputSchema>;
