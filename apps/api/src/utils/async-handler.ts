import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler =
  (handler: (request: Request, response: Response, next: NextFunction) => unknown | Promise<unknown>): RequestHandler =>
  (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
