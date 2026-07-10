import { prisma } from "../database";

export type CreateUploadInput = {
  cloudinaryPublicId: string;
  secureUrl: string;
  width: number;
  height: number;
};

export const createUpload = (input: CreateUploadInput) =>
  prisma.upload.create({
    data: input,
  });

export const findUploadById = (id: string) =>
  prisma.upload.findUnique({
    where: {
      id,
    },
  });

export const deleteUploadById = (id: string) =>
  prisma.upload.delete({
    where: {
      id,
    },
  });
