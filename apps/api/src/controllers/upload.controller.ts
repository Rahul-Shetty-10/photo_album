import type { Request, Response } from "express";

import { createUploadFromImage, deleteUpload } from "../services/upload.service";
import { AppError } from "../utils/app-error";

export const uploadImage = async (request: Request, response: Response) => {
  if (!request.file) {
    throw new AppError("Image file is required", 400);
  }

  const image = await createUploadFromImage(request.file);

  response.status(201).json(image);
};

export const removeUpload = async (request: Request, response: Response) => {
  const { id } = request.params;

  if (Array.isArray(id)) {
    throw new AppError("Invalid upload id", 400);
  }

  await deleteUpload(id);

  response.status(204).send();
};
