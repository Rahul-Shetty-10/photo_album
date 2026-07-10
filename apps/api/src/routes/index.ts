import { Router } from "express";

import { generationJobRouter } from "./generation-job.routes";
import { healthRouter } from "./health.routes";
import { uploadRouter } from "./upload.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(uploadRouter);
apiRouter.use(generationJobRouter);
