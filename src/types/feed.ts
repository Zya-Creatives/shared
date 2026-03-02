import z from "zod";
import {
  FeedTagsInputSchema,
  FeedTagsSchema,
  TrendingUsersOutputSchema,
} from "../schemas/feed";

export type FeedTagsInput = z.infer<typeof FeedTagsInputSchema>;
export type FeedTagsOutput = z.infer<typeof FeedTagsSchema>;
export type TrendingUsersOutput = z.infer<typeof TrendingUsersOutputSchema>;
