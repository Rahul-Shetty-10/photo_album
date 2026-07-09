import type { ErrorRequestHandler } from "express";

import { config } from "../config";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";

export const globalErrorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const appError =
    error instanceof AppError
      ? error
      : new AppError("Internal server error", 500, false);

  logger.error(
    {
      error,
      method: request.method,
      path: request.path,
      requestId: request.requestId,
    },
    appError.message,
  );

  response.status(appError.statusCode).json({
    status: "error",
    message:
      appError.isOperational || config.nodeEnv !== "production"
        ? appError.message
        : "Internal server error",
    requestId: request.requestId,
  });
};
