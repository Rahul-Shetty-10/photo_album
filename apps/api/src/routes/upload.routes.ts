import { Router } from "express";

import { removeUpload, uploadImage } from "../controllers/upload.controller";
import { uploadMiddleware } from "../middleware/upload";
import { asyncHandler } from "../utils/async-handler";

export const uploadRouter = Router();

uploadRouter.post("/upload", uploadMiddleware.single("image"), asyncHandler(uploadImage));
uploadRouter.delete("/upload/:id", asyncHandler(removeUpload));
