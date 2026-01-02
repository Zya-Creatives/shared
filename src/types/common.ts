import z from "zod";
import { ProjectSocialGraphEntitySchema } from "../schemas";

export type ProjectSocialGraphEntity = z.infer<
  typeof ProjectSocialGraphEntitySchema
>;
export type PostSocialGraphEntity = z.infer<
  typeof ProjectSocialGraphEntitySchema
>;
