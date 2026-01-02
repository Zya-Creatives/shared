import { z } from "@hono/zod-openapi";
import { ACTIVITY_PARENT_TYPES } from "../constants";

export const ViewEntitySchema = z
  .object({
    id: z.cuid2().openapi({
      description: "Unique identifier of the view record.",
      title: "View ID",
    }),
    userId: z.cuid2().nullable().openapi({
      description:
        "Identifier of the user who viewed the entity, if authenticated.",
      title: "User ID",
    }),
    ipAddress: z.string().nullable().openapi({
      description: "IP address from which the entity was viewed.",
      title: "IP Address",
    }),
    userAgent: z.string().nullable().openapi({
      description:
        "User agent string identifying the client device or browser.",
      title: "User Agent",
    }),
    parentId: z.cuid2().openapi({
      description: "Identifier of the parent entity being viewed.",
      title: "Parent ID",
    }),
    parentType: z.enum(ACTIVITY_PARENT_TYPES).openapi({
      description: "Type of the parent entity (e.g., project, post, etc.).",
      title: "Parent Type",
    }),
    sessionId: z.string().nullable().openapi({
      description:
        "Session identifier associated with the view event, if available.",
      title: "Session ID",
    }),
    viewedAt: z.coerce.date().optional().openapi({
      description: "Exact timestamp when the view occurred.",
      title: "Viewed At",
    }),
    viewDate: z.coerce.date().optional().openapi({
      description:
        "Calendar date corresponding to the view event, used for aggregation.",
      title: "View Date",
    }),
  })
  .openapi({
    description: "Represents a record of a single view event for an entity.",
    title: "View",
  });
