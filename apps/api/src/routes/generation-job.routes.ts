import { Router } from "express";

import { createGenerationJob, getGenerationJob, getGenerationJobStatusById } from "../controllers/generation-job.controller";
import { asyncHandler } from "../utils/async-handler";

export const generationJobRouter = Router();

generationJobRouter.post("/generate", asyncHandler(createGenerationJob));
generationJobRouter.get("/generate/:id", asyncHandler(getGenerationJob));
generationJobRouter.get("/generate/:id/status", asyncHandler(getGenerationJobStatusById));
generationJobRouter.post("/generation-jobs", asyncHandler(createGenerationJob));
generationJobRouter.get("/generation-jobs/:id", asyncHandler(getGenerationJob));
