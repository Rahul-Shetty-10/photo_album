import { z } from "zod";

export const createProjectSchema = z.object({
  eventCategory: z.string().trim().min(1, "Event category is required").max(80, "Event category is too long"),
  name: z.string().trim().min(1, "Project name is required").max(120, "Project name is too long"),
});

export const renameProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(120, "Project name is too long"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type RenameProjectInput = z.infer<typeof renameProjectSchema>;
