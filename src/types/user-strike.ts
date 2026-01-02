import { z } from "@hono/zod-openapi";
import {
  UpsertUserStrikeInputSchema,
  UserStrikeEntitySchema,
} from "../schemas/user-strike";
export type UserStrikeEntity = z.infer<typeof UserStrikeEntitySchema>;

export type UpsertUserStrikeInput = z.infer<typeof UpsertUserStrikeInputSchema>;

export type UpsertUserStrikeOutput = UserStrikeEntity;
