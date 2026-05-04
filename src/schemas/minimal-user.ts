// schemas/minimal-user.ts
import { z } from "@hono/zod-openapi";
import { ROLES } from "../constants";
import type { Role } from "../constants";

export const MinimalUserSchema = z
    .object({
        id: z.cuid2(),
        name: z.string().default(""),
        email: z.email(),
        image: z.string().default(""),
        username: z.string().default(""),
        role: z.enum(Object.values(ROLES) as [Role, ...Role[]]),
    })
    .openapi("MinimalUser");

export type MinimalUser = z.infer<typeof MinimalUserSchema>;