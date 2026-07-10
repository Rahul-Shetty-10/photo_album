import { Prisma } from "@prisma/client";

import { createUpload, deleteUploadById, findUploadById } from "../repositories/upload.repository";
import { deleteImage, uploadImageBuffer } from "../storage";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const createUploadFromImage = async (file: Express.Multer.File) => {
  const image = await uploadImageBuffer(file);

  try {
    const upload = await createUpload({
      cloudinaryPublicId: image.publicId,
      height: image.height,
      secureUrl: image.secureUrl,
      width: image.width,
    });

    return {
      uploadId: upload.id,
      ...image,
    };
  } catch (error) {
    logger.error(
      {
        cloudinaryPublicId: image.publicId,
        error,
        secureUrl: image.secureUrl,
      },
      "Failed to save upload metadata",
    );

    await deleteImage(image.publicId);
    throw new AppError("Failed to save upload metadata", 500, true);
  }
};

export const deleteUpload = async (id: string) => {
  if (!uuidPattern.test(id)) {
    throw new AppError("Invalid upload id", 400);
  }

  const upload = await findUploadById(id);

  if (!upload) {
    throw new AppError("Upload not found", 404);
  }

  try {
    await deleteImage(upload.cloudinaryPublicId);
    await deleteUploadById(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new AppError("Upload not found", 404);
    }

    throw error;
  }
};
