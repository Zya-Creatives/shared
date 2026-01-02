import z from "zod";
import { LoginSchema, RegisterSchema } from "../schemas/auth";

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
