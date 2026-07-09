import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { config } from "./config";
import { globalErrorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { requestIdMiddleware } from "./middleware/request-id";
import { apiRouter } from "./routes";
import { logger } from "./utils/logger";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
    }),
  );
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      customProps: (request) => ({
        requestId: request.requestId,
      }),
    }),
  );

  app.use(`/api/${config.apiVersion}`, apiRouter);
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};
