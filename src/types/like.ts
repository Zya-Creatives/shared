import { z } from "@hono/zod-openapi";
import { LikeEntitySchema } from "../schemas/like";

export type LikeEntity = z.infer<typeof LikeEntitySchema>