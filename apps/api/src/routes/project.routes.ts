import { Router } from "express";

import {
  archiveProject,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  renameProject,
} from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const projectRouter = Router();

projectRouter.use("/projects", requireAuth);
projectRouter.post("/projects", asyncHandler(createProject));
projectRouter.get("/projects", asyncHandler(listProjects));
projectRouter.get("/projects/:id", asyncHandler(getProject));
projectRouter.patch("/projects/:id", asyncHandler(renameProject));
projectRouter.patch("/projects/:id/archive", asyncHandler(archiveProject));
projectRouter.delete("/projects/:id", asyncHandler(deleteProject));
