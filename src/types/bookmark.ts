import { z } from "@hono/zod-openapi";
import { BookmarkEntitySchema } from "../schemas/bookmark";

export type BookmarkEntity = z.infer<typeof BookmarkEntitySchema>;
