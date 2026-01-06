import { z } from "@hono/zod-openapi";
import type {
    NotificationEntitySchema,
    MinimalNotificationEntitySchema,
    NotificationDetailsEntitySchema,
    ListNotificationsInputSchema,
    ListNotificationsOutputSchema,
    MarkReadInputSchema,
    NotificationCountOutputSchema,
} from "../schemas/notification";

export type NotificationEntity = z.infer<typeof NotificationEntitySchema>;

export type MinimalNotificationEntity = z.infer<
    typeof MinimalNotificationEntitySchema
>;

export type NotificationDetailsEntity = z.infer<
    typeof NotificationDetailsEntitySchema
>;

export type ListNotificationsInput = z.infer<
    typeof ListNotificationsInputSchema
>;

export type ListNotificationsOutput = z.infer<
    typeof ListNotificationsOutputSchema
>;

export type MarkReadInput = z.infer<typeof MarkReadInputSchema>;

export type NotificationCountOutput = z.infer<
    typeof NotificationCountOutputSchema
>;
