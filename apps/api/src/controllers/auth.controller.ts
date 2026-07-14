import type { Request, Response } from "express";
import { ZodError } from "zod";

import { loginUser, registerUser } from "../services/auth.service";
import { AppError } from "../utils/app-error";
import { loginSchema, registerSchema } from "../validators/auth.schema";

const parseRequest = <T>(parser: { parse: (value: unknown) => T }, value: unknown) => {
  try {
    return parser.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(error.issues[0]?.message ?? "Invalid request body", 400);
    }

    throw error;
  }
};

export const register = async (request: Request, response: Response) => {
  const result = await registerUser(parseRequest(registerSchema, request.body));

  response.status(201).json(result);
};

export const login = async (request: Request, response: Response) => {
  const result = await loginUser(parseRequest(loginSchema, request.body));

  response.status(200).json(result);
};

export const logout = async (_request: Request, response: Response) => {
  response.status(200).json({ status: "ok" });
};

export const getCurrentUser = async (request: Request, response: Response) => {
  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({ user: request.user });
};
