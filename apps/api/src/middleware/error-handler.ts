import type { ErrorRequestHandler } from "express";
import multer from "multer";

import { config } from "../config";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";

export const globalErrorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  void _next;

  const appError =
    error instanceof AppError
      ? error
      : error instanceof multer.MulterError
        ? new AppError(getMulterErrorMessage(error), getMulterErrorStatusCode(error))
      : isBodyParserError(error)
        ? new AppError("Request body must be valid JSON", 400)
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

const isBodyParserError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "type" in error &&
  (error as { type?: string }).type === "entity.parse.failed";

const getMulterErrorMessage = (error: multer.MulterError) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return "Image file must be 10MB or smaller";
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return "Only one image file is allowed";
  }

  return "Invalid upload";
};

const getMulterErrorStatusCode = (error: multer.MulterError) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return 413;
  }

  return 400;
};
