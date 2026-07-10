import multer from "multer";

import { AppError } from "../utils/app-error";

const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadMiddleware = multer({
  fileFilter: (_request, file, callback) => {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      callback(new AppError("Only JPEG, PNG, and WebP images are allowed", 400));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  storage: multer.memoryStorage(),
});
