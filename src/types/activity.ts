import z from "zod";
import { ActivitySchema } from "../schemas/activity";

export type ActivityEntity = z.infer<typeof ActivitySchema>;
