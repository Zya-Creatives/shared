import { z } from "@hono/zod-openapi";
import { UsernameSchema } from "../schemas";

export type UsernameInput = z.infer<typeof UsernameSchema>;
