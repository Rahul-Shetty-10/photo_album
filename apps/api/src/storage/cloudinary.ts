import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Readable } from "node:stream";

import { config } from "../config";
import { logger } from "../utils/logger";

cloudinary.config({
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  cloud_name: config.cloudinary.cloudName,
  secure: true,
});

export type CloudinaryImageUpload = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
};

const toUploadResponse = (result: UploadApiResponse): CloudinaryImageUpload => ({
  publicId: result.public_id,
  secureUrl: result.secure_url,
  width: result.width,
  height: result.height,
  format: result.format,
});

export const uploadImageBuffer = async (file: Express.Multer.File): Promise<CloudinaryImageUpload> => {
  logger.info({ mimetype: file.mimetype, originalname: file.originalname, size: file.size }, "Uploading source image to Cloudinary");

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "alankar/uploads",
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error) {
          reject(error);
          return;
        }

        if (!uploadResult) {
          reject(new Error("Cloudinary upload did not return a result"));
          return;
        }

        resolve(uploadResult);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

  const response = toUploadResponse(result);
  logger.info({ response }, "Source image Cloudinary upload completed");

  return response;
};

export const uploadImageUrl = async (url: string): Promise<CloudinaryImageUpload> => {
  logger.info({ url }, "Uploading remote generated image to Cloudinary");

  const result = await cloudinary.uploader.upload(url, {
    folder: "alankar/generated",
    resource_type: "image",
  });

  const response = toUploadResponse(result);
  logger.info({ response }, "Remote generated image Cloudinary upload completed");

  return response;
};

export const deleteImage = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};
