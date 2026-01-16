import z from "zod";
import { FeedTagsInputSchema, FeedTagsSchema } from "../schemas/feed";

export type FeedTagsInput = z.infer<typeof FeedTagsInputSchema>;
export type FeedTagsOutput = z.infer<typeof FeedTagsSchema>;
