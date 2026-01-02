import { z } from "@hono/zod-openapi";
import { EntityStatsSchema } from "../schemas/entity-stats";

export type EntityStatsEntity = z.infer<typeof EntityStatsSchema>;
