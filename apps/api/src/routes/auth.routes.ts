import { Router } from "express";

import { getCurrentUser, login, logout, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const authRouter = Router();

authRouter.post("/auth/register", asyncHandler(register));
authRouter.post("/auth/login", asyncHandler(login));
authRouter.post("/auth/logout", requireAuth, asyncHandler(logout));
authRouter.get("/auth/me", requireAuth, asyncHandler(getCurrentUser));
