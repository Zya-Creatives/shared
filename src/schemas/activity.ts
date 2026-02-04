import z from "zod";
import { ACTIVITY_TYPES } from "../constants";

export const ActivitySchema = z.object({
  id: z.cuid2().openapi({
    description: "Unique identifier for the bookmarked entity.",
    title: "Entity ID",
  }),
  type: z.enum(ACTIVITY_TYPES),
  actorName: z.string(),
  actorId: z.string(),
  actorUsername: z.string(),
  actorImageUrl: z.url().optional(),
  followsYou: z.boolean().optional(),
  isFollowing: z.boolean().optional(),
});

