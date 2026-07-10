import { prisma } from "../database";

export type CreateGenerationJobInput = {
  aspectRatio: string;
  brideUploadId: string;
  customPrompt?: string;
  groomUploadId: string;
  model: string;
  numberOfImages: number;
  prompt: string;
  progress: number;
  provider: string;
  seeds: number[];
  status: string;
  style: string;
  theme: string;
};

export type CreateGeneratedImageInput = {
  height?: number;
  jobId: string;
  publicId: string;
  secureUrl: string;
  seed?: number;
  width?: number;
};

export const createGenerationJob = (input: CreateGenerationJobInput) =>
  prisma.generationJob.create({
    data: input,
  });

export const findGenerationJobById = (id: string) =>
  prisma.generationJob.findUnique({
    where: {
      id,
    },
    include: {
      brideUpload: true,
      generatedImages: {
        orderBy: {
          createdAt: "asc",
        },
      },
      groomUpload: true,
    },
  });

export const updateGenerationJob = (
  id: string,
  data: Partial<{
    completedAt: Date;
    errorMessage: string | null;
    failedAt: Date;
    progress: number;
    startedAt: Date;
    status: string;
  }>,
) =>
  prisma.generationJob.update({
    data,
    where: {
      id,
    },
  });

export const updateGenerationJobStatus = (id: string, status: string) =>
  updateGenerationJob(id, {
    status,
  });

export const createGeneratedImage = (input: CreateGeneratedImageInput) =>
  prisma.generatedImage.create({
    data: input,
  });
