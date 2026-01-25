import { z } from "@hono/zod-openapi";
import { CLIENT_TYPES, ROLES } from "../constants";
import { CreateFileInputSchema, FileEntitySchema } from "./file";
import { CommentEntitySchema } from "./comment";
import { BookmarkEntitySchema } from "./bookmark";
import { ViewEntitySchema } from "./view";
import { MinimalUserSchema } from "./user";
import { ActivitySchema } from "./activity";

export const ProjectEntitySchema = z
  .object({
    id: z.string().openapi({
      description: "CUID2 of the project.",
      example: "ckl1y9xyz0000qv7a0h1efgh4",
    }),
    userId: z.string().openapi({
      description: "CUID2 of the user who created the project.",
      example: "ckl1y9xyz0000qv7a0h1efgh4",
    }),
    title: z.string().openapi({
      description: "Title of the project.",
      example: "E-commerce Mobile App",
    }),
    description: z.string().optional().openapi({
      description: "Detailed description of the project, max 1000 characters.",
      example:
        "A modern e-commerce mobile application built with React Native.",
    }),
    overview: z.string().optional().openapi({
      description: "Brief overview of the project.",
      example: "A comprehensive e-commerce solution for mobile devices.",
    }),
    url: z.string().optional().openapi({
      description: "URL to the project or live demo.",
      example: "https://example.com/project",
    }),
    imagePlaceholderUrl: z.string().url().openapi({
      description: "URL for the placeholder image of the project.",
      example: "https://img.com",
    }),
    tags: z
      .array(z.string())
      .optional()
      .openapi({
        description: "Array of tags associated with the project.",
        example: ["react-native", "e-commerce", "mobile"],
      }),
    projectCreatorType: z.enum(ROLES).openapi({
      description: "Type of creator who made this project.",
      example: "CREATIVE",
    }),
    clientId: z.string().optional().openapi({
      description: "CUID2 of the client if this is a client project.",
      example: "ckl1y9xyz0000qv7a0h1efgh4",
    }),
    clientType: z.enum(CLIENT_TYPES).optional().openapi({
      description: "Type of client for this project.",
      example: "BRAND",
    }),
    clientName: z.string().optional().openapi({
      description: "Name of the client.",
      example: "Acme Corp",
    }),
    isFeatured: z.boolean().optional().openapi({
      description: "Whether the project is featured.",
      example: true,
    }),
    startDate: z.coerce
      .date()
      .optional()
      .openapi({
        description: "Start date of the project.",
        example: new Date("2024-01-01"),
      }),
    endDate: z.coerce
      .date()
      .optional()
      .openapi({
        description: "End date of the project.",
        example: new Date("2024-06-30"),
      }),
    createdAt: z.coerce.date().openapi({
      description: "Timestamp when the project was created.",
      example: new Date("2024-01-01T00:00:00.000Z"),
    }),
    updatedAt: z.coerce.date().openapi({
      description: "Timestamp when the project was last updated.",
      example: new Date("2024-06-30T00:00:00.000Z"),
    }),
    version: z.int(),
  })
  .openapi({
    title: "Project DB Entity",
    description: "Schema representing a project stored in the database.",
  });

export const ProjectFileEntitySchema = z
  .object({
    id: z
      .string()
      .openapi({ description: "CUID2 of the project file record." }),
    projectId: z.string().openapi({
      description: "CUID2 of the project this file belongs to.",
    }),
    fileId: z.string().openapi({ description: "CUID2 of the linked file." }),
    isPlaceholder: z.boolean().openapi({
      description: "Indicates whether the file is a placeholder.",
      example: false,
    }),
    order: z.number().int().openapi({
      description: "Order index of the file in the project.",
      example: 1,
    }),
  })
  .openapi({
    title: "Project File Entity",
    description: "Schema representing a file associated with a project.",
  });

export const ProjectSocialGraphEntitySchema = z
  .object({
    noOfLikes: z.number().int().optional().openapi({ example: 150 }),
    noOfComments: z.number().int().optional().openapi({ example: 45 }),
    noOfBookmarks: z.number().int().optional().openapi({ example: 22 }),
    noOfViews: z.number().int().optional().openapi({ example: 1200 }),
  })
  .openapi("ProjectSocialGraphEntity");

export const ProjectDetailsEntitySchema = ProjectEntitySchema.extend({
  user: MinimalUserSchema,
  projectFiles: z
    .array(
      ProjectFileEntitySchema.extend({
        file: FileEntitySchema,
      }),
    )
    .optional()
    .openapi({ description: "Files associated with the project." }),
}).openapi({ title: "ProjectDetailsEntity" });

export const ProjectUpdateOutputEntitySchema = z
  .object({ id: z.cuid2() })
  .openapi("ProjectUpdateOutputEntity");

export const CreateProjectInputSchema = z
  .object({
    title: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
    overview: z.string().optional(),
    url: z.string().optional(),
    imagePlaceholderUrl: z.url(),
    tags: z.array(z.string()).default([]),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    projectCreatorType: z.enum(ROLES).default(ROLES.CREATIVE),
    clientId: z.string().optional(),
    clientType: z.enum(CLIENT_TYPES).default(CLIENT_TYPES.NONE),
    clientName: z.string().optional(),
    files: z.array(
      CreateFileInputSchema.extend({
        isPlaceholder: z.boolean().default(false),
        order: z.int().default(1),
      }),
    ),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!startDate) return;
    if (startDate > today)
      ctx.addIssue({
        path: ["startDate"],
        code: "custom",
        message: "Start date cannot be in the future",
      });
    if (endDate) {
      if (startDate > endDate)
        ctx.addIssue({
          path: ["startDate"],
          code: "custom",
          message: "Start date cannot be after end date",
        });
    }
  })
  .openapi({ title: "Create Project" });

export const UpdateProjectInputSchema = z
  .object({
    id: z.cuid2(),
    title: z.string().optional(),
    description: z.string().optional(),
    overview: z.string().optional(),
    url: z.url().optional(),
    imagePlaceholderUrl: z.url().optional(),
    tags: z.array(z.string()).optional(),
    projectCreatorType: z.enum(ROLES).optional(),
    clientId: z.cuid2().optional(),
    clientType: z.enum(CLIENT_TYPES).optional(),
    clientName: z.string().optional(),
    isFeatured: z.boolean().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    version: z.int(),
  })
  .openapi({ title: "Update Project" });

export const CreateProjectOutputSchema = ProjectEntitySchema;
export const UpdateProjectOutputSchema = ProjectEntitySchema;
export const DeleteProjectOutputSchema = ProjectEntitySchema;

export const GetProjectOutputSchema = ProjectDetailsEntitySchema.extend({
  isLiked: z.boolean().optional(),
  isBookmarked: z.boolean().optional(),
});

export const ProjectIdSchema = z.object({ projectId: z.cuid2() });
export const MinimalProjectSchema = ProjectEntitySchema.pick({
  id: true,
  title: true,
  description: true,
  tags: true,
  startDate: true,
  endDate: true,
  imagePlaceholderUrl: true,
}).openapi({
  title: "MinimalProject",
});

export const SearchProjectsInputSchema = z
  .object({
    query: z.string().optional(),
    tags: z.array(z.string()).optional(),
    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(20)
      .openapi({ example: 20 }),
    cursor: z
      .string()
      .optional()
      .openapi({ example: "ckl1y9xyz0000qv7a0h1efgh4" }),
  })
  .openapi({
    title: "ListProjectsInput",
  });

export const SearchProjectsOutputSchema = z
  .object({
    projects: z.array(MinimalProjectSchema),
    nextCursor: z.string().optional().nullable(),
  })
  .openapi({
    title: "SearchProjectsOutput",
  });

export const ProjectWithProjectViewsEntitySchema = MinimalProjectSchema.extend({
  views: z.array(ViewEntitySchema),
}).openapi({
  title: "ProjectWithProjectViewsEntity",
});

export const ProjectWithProjectCommentsEntitySchema =
  MinimalProjectSchema.extend({
    comments: z.array(CommentEntitySchema),
  }).openapi({
    title: "ProjectWithProjectCommentsEntity",
  });

export const ProjectWithLikesEntitySchema = MinimalProjectSchema.extend({
  likes: z.array(
    ActivitySchema.extend({
      followsYou: z.boolean().optional(),
      isFollowing: z.boolean().optional(),
    }),
  ),
}).openapi({
  title: "ProjectWithProjectLikesEntity",
});

export const ProjectWithProjectBookmarksEntitySchema =
  MinimalProjectSchema.extend({
    bookmarks: z.array(BookmarkEntitySchema),
  }).openapi({
    title: "ProjectWithProjectBookmarksEntity",
  });

export const GetProjectWithCommentsOutputSchema =
  ProjectWithProjectCommentsEntitySchema.extend({
    nextCursor: z.string().optional().nullable(),
  });

export const GetProjectWithLikesOutputSchema =
  ProjectWithLikesEntitySchema.extend({
    nextCursor: z.string().optional().nullable(),
  });
