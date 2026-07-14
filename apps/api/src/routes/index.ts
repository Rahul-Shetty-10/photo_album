import { Router } from "express";

import { authRouter } from "./auth.routes";
import { generationJobRouter } from "./generation-job.routes";
import { healthRouter } from "./health.routes";
import { projectRouter } from "./project.routes";
import { uploadRouter } from "./upload.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);
apiRouter.use(projectRouter);
apiRouter.use(uploadRouter);
apiRouter.use(generationJobRouter);
