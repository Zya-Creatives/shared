import { z } from "@hono/zod-openapi";
import { EXPERIENCE_LEVELS, ExperienceLevel, LINK_TYPES } from "../constants";
import { ProfileIdentifierSchema } from "./common";
import { MinimalUserSchema } from "./user";

export const MinimalCreativeEntitySchema = z.object({
    id: z.cuid2().openapi({ example: "cre_cksd0v6q0000s9a5y8z7p3x9" }),
    userId: z.cuid2().openapi({ example: "user_abc123" }),
    bio: z.string().optional().openapi({
        example:
            "A multi-disciplinary designer specializing in brand identity.",
    }),
    role: z.string().optional().openapi({ example: "Designer" }),
    location: z.string().optional().openapi({ example: "London, UK" }),
    experienceLevel: z
        .enum(
            Object.values(EXPERIENCE_LEVELS) as [
                ExperienceLevel,
                ...ExperienceLevel[],
            ],
        )
        .optional()
        .openapi({ example: EXPERIENCE_LEVELS.YEAR_0_1 }),

    disciplines: z
        .array(z.string())
        .optional()
        .openapi({ example: ["Design", "Art Direction"] }),
    createdAt: z.coerce.date().openapi({ example: "2025-10-13T09:00:00.000Z" }),
    updatedAt: z.coerce.date().openapi({ example: "2025-10-13T09:00:00.000Z" }),
});

export const CreativeEntitySchema = z
    .object({
        id: z.cuid2().openapi({ example: "cre_cksd0v6q0000s9a5y8z7p3x9" }),
        userId: z.cuid2().openapi({ example: "user_abc123" }),
        bio: z.string().optional().openapi({
            example:
                "A multi-disciplinary designer specializing in brand identity.",
        }),
        role: z.string().optional().openapi({ example: "Designer" }),
        location: z.string().optional().openapi({ example: "London, UK" }),
        experienceLevel: z
            .enum(
                Object.values(EXPERIENCE_LEVELS) as [
                    ExperienceLevel,
                    ...ExperienceLevel[],
                ],
            )
            .optional()
            .openapi({ example: EXPERIENCE_LEVELS.YEAR_0_1 }),

        disciplines: z
            .array(z.string())
            .optional()
            .openapi({ example: ["Design", "Art Direction"] }),
        workExperience: z
            .object({
                companyName: z.string(),
                position: z.string(),
                startDate: z.coerce.date().optional(),
                endDate: z.coerce.date().optional(),
                currentlyWorking: z.boolean().optional(),
                description: z.string(),
            })
            .array()
            .optional(),
        links: z
            .object({
                url: z.union([
                    z.url({ message: "Please enter a valid URL" }),
                    z.literal(""),
                ]),
                type: z.enum(LINK_TYPES),
            })
            .array()
            .optional(),
        achievements: z
            .object({
                title: z.string(),
                link: z.string().optional(),
                year: z.coerce.number().int().optional(),
            })
            .array()
            .optional(),
        createdAt: z.coerce
            .date()
            .optional()
            .openapi({ example: "2025-10-13T09:00:00.000Z" }),
        updatedAt: z.coerce
            .date()
            .openapi({ example: "2025-10-13T09:00:00.000Z" }),
    })
    .openapi({
        title: "CreativeEntitySchema",
        description:
            "Represents a creative profile, including bio, experience level, location, disciplines and timestamps.",
    });

export const ListCreativesInputSchema = z
    .object({
        query: z.string().optional().openapi({ example: "logo designer" }),

        disciplines: z
            .array(z.string())
            .optional()
            .openapi({ example: ["branding", "web design"] }),

        experienceLevels: z
            .array(
                z.enum(
                    Object.values(EXPERIENCE_LEVELS) as [
                        ExperienceLevel,
                        ...ExperienceLevel[],
                    ],
                ),
            )
            .optional()
            .openapi({
                example: [
                    EXPERIENCE_LEVELS.YEAR_1_3,
                    EXPERIENCE_LEVELS.YEAR_5_PLUS,
                ],
            }),

        location: z.string().optional().openapi({ example: "Los Angeles" }),

        page: z
            .number()
            .int()
            .min(1)
            .default(1)
            .optional()
            .openapi({ example: 1 }),

        perPage: z
            .number()
            .int()
            .min(1)
            .max(100)
            .default(20)
            .optional()
            .openapi({ example: 20 }),
    })
    .openapi({
        title: "ListCreativesInput",
        description:
            "Query parameters for filtering and paginating creatives. Supports text search, discipline filtering, experience level filtering, tag filtering, location filtering, and pagination settings.",
    });

export const CreateCreativeProfileInputSchema = z
    .object({
        experienceLevel: z
            .enum(EXPERIENCE_LEVELS)
            .describe("Overall experience range of the creative.")
            .default(EXPERIENCE_LEVELS.YEAR_0_1)
            .openapi({
                example: EXPERIENCE_LEVELS.YEAR_1_3,
            }),
        role: z.string().optional().openapi({ example: "Designer" }),

        location: z
            .string()
            .max(100)
            .optional()
            .describe("Primary location where the creative works or resides.")
            .openapi({
                example: "Lagos, Nigeria",
            }),

        disciplineSlugs: z
            .array(z.string())
            .min(1, "At least one discipline is required")
            .default([])
            .describe(
                "List of discipline slugs representing the creative’s fields.",
            )
            .openapi({
                example: ["ui-ux", "frontend"],
            }),
    })
    .openapi({
        title: "create creative profile",
        description: "Payload for creating a new creative profile.",
    });

export const UpdateCreativeProfileInputSchema = z
    .object({
        expectedUpdateAt: z.iso.datetime(),
        experienceLevel: z
            .enum(EXPERIENCE_LEVELS)
            .optional()
            .openapi({ example: EXPERIENCE_LEVELS.YEAR_3_5 }),
        role: z.string().optional().openapi({ example: "Designer" }),
        bio: z
            .string()
            .max(600)
            .optional()
            .openapi({ example: "I am a freelance UI/UX designer." }),
        location: z
            .string()
            .max(100)
            .optional()
            .openapi({ example: "Lagos, Nigeria" }),
        disciplineSlugs: z
            .array(z.string())
            .min(1, "At least one discipline is required")
            .optional()
            .openapi({ example: ["frontend", "ui-ux"] }),
        workExperience: z
            .object({
                companyName: z.string(),
                position: z.string(),
                startDate: z.string().optional(),
                endDate: z.string().optional(),
                currentlyWorking: z.boolean().default(false),
                description: z.string().optional(),
            })
            .array()
            .optional(),
        links: z
            .object({
                url: z.union([
                    z.url({ message: "Please enter a valid URL" }),
                    z.literal(""),
                ]),
                type: z.enum(LINK_TYPES),
            })
            .array()
            .optional(),
        achievements: z
            .object({
                title: z.string(),
                link: z.string().optional(),
                year: z.coerce.number().int().optional(),
            })
            .array()
            .optional(),
    })
    .openapi({
        title: "update creative profile",
    });

export const GetCreativeInputSchema = z.object({
    value: z.cuid2(),
    by: ProfileIdentifierSchema.shape.by,
});

export const GetCreativeQuerySchema = ProfileIdentifierSchema;

export const CreateCreativeOutputSchema = CreativeEntitySchema;

export const GetCreativeOutputSchema = CreativeEntitySchema;

export const UpdateCreativeOutputSchema = CreativeEntitySchema;

export const CreativeWithUserEntitySchema = MinimalCreativeEntitySchema.extend({
    user: MinimalUserSchema,
});

export const SearchCreativeInputSchema = z.object({
    string: z
        .string()
        .min(1, { message: "Search string cannot be empty" })
        .max(200, { message: "Search string cannot exceed 200 characters" }),
    limit: z.coerce
        .number()
        .int({ message: "Limit must be an integer" })
        .min(1, { message: "Limit must be at least 1" })
        .max(100, { message: "Limit cannot exceed 100" })
        .default(20),
    cursor: z.string().optional(),
});

export const SearchCreativeOutputSchema = z.object({
    creatives: z.array(CreativeWithUserEntitySchema),
    nextCursor: z.string().optional().nullable(),
});
