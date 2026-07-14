import type { RequestHandler } from "express";

import { verifyAuthToken } from "../services/auth.service";
import { AppError } from "../utils/app-error";

const bearerPrefix = "Bearer ";

export const requireAuth: RequestHandler = async (request, _response, next) => {
  const authorization = request.header("authorization");

  if (!authorization?.startsWith(bearerPrefix)) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    request.user = await verifyAuthToken(authorization.slice(bearerPrefix.length).trim());
    next();
  } catch (error) {
    next(error);
  }
};

export const requireUser: RequestHandler = (request, _response, next) => {
  if (!request.user) {
    next(new AppError("Authentication required", 401));
    return;
  }

  next();
};
