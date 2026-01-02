import z from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().max(255, { message: "First name is too long" }),
  lastName: z.string().max(255, { message: "Last name is too long" }),
  email: z
    .email({ message: "Enter a valid email address" })
    .max(255, { message: "Email is too long" }),
  username: z
    .string()
    .min(3, { message: "Username is too short" })
    .max(32, { message: "Username must be at most 32 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username can only contain letters, numbers, and underscores",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be at most 100 characters" }),
});

export const LoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Email or username is required" })
    .refine(
      (val) => {
        const isEmail = z.email().safeParse(val).success;
        const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(val);
        return isEmail || isUsername;
      },
      {
        message:
          "Enter a valid email or a username (3–20 characters, letters/numbers/underscore)",
      }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be at most 100 characters" }),
  rememberMe: z.boolean(),
});
