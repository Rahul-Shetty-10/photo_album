import { generatorService } from "../ai/generator.service";
import { buildWeddingPrompt, getWeddingTheme } from "../ai/themes";
import { enqueueGenerationJob } from "../queues";
import {
  createGenerationJob,
  findGenerationJobById,
  updateGenerationJob,
  updateGenerationJobStatus,
} from "../repositories/generation-job.repository";
import { findUploadById } from "../repositories/upload.repository";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";
import { Prisma } from "@prisma/client";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validAspectRatios = new Set(["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"]);
const maxImages = 8;
const databaseAttempts = 3;
const databaseRetryDelayMs = 750;

export type CreateGenerationJobRequest = {
  aspectRatio?: unknown;
  brideUploadId?: unknown;
  customPrompt?: unknown;
  groomUploadId?: unknown;
  numberOfImages?: unknown;
  seed?: unknown;
  style?: unknown;
  theme?: unknown;
};

export const createPendingGenerationJob = async (input: CreateGenerationJobRequest) => {
  logger.info({ body: input }, "Incoming generation request body");

  const brideUploadId = validateUploadId(input.brideUploadId, "brideUploadId");
  const groomUploadId = validateUploadId(input.groomUploadId, "groomUploadId");
  const { name: themeName } = getWeddingTheme(typeof input.theme === "string" ? input.theme : undefined);
  const aspectRatio = validateAspectRatio(input.aspectRatio);
  const customPrompt = validateOptionalString(input.customPrompt, "customPrompt");
  const numberOfImages = validateNumberOfImages(input.numberOfImages);
  const seeds = buildSeeds(input.seed, numberOfImages);
  const style = typeof input.style === "string" && input.style.trim().length > 0 ? input.style.trim() : themeName;
  const prompt = buildWeddingPrompt(themeName, customPrompt);

  const [brideUpload, groomUpload] = await withDatabaseRetry(
    () => Promise.all([findUploadById(brideUploadId), findUploadById(groomUploadId)]),
    "find generation uploads",
  );

  if (!brideUpload) {
    logger.warn({ brideUploadId }, "Generation validation failed: bride upload not found");
    throw new AppError("Bride upload not found", 404);
  }

  if (!groomUpload) {
    logger.warn({ groomUploadId }, "Generation validation failed: groom upload not found");
    throw new AppError("Groom upload not found", 404);
  }

  validateCloudinaryHttpsUrl(brideUpload.secureUrl, "brideUpload");
  validateCloudinaryHttpsUrl(groomUpload.secureUrl, "groomUpload");

  const job = await withDatabaseRetry(
    () =>
      createGenerationJob({
        aspectRatio,
        brideUploadId,
        customPrompt,
        groomUploadId,
        model: generatorService.model,
        numberOfImages,
        prompt,
        progress: 0,
        provider: generatorService.providerName,
        seeds,
        status: "Queued",
        style,
        theme: themeName,
      }),
    "create generation job",
  );

  logger.info(
    {
      aspectRatio,
      brideUploadId,
      groomUploadId,
      jobId: job.id,
      model: generatorService.model,
      numberOfImages,
      provider: generatorService.providerName,
      seeds,
      theme: themeName,
    },
    "GenerationJob created",
  );

  try {
    const queueJob = await enqueueGenerationJob(job.id);
    logger.info({ bullJobId: queueJob.id, generationJobId: job.id }, "GenerationJob enqueued");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation queue is unavailable";

    await withDatabaseRetry(
      () =>
        updateGenerationJob(job.id, {
          errorMessage: message,
          failedAt: new Date(),
          progress: 100,
          status: "Failed",
        }),
      "mark generation failed after enqueue error",
    );

    throw error;
  }

  await withDatabaseRetry(() => updateGenerationJobStatus(job.id, "Queued"), "confirm generation queued status");

  const response = {
    jobId: job.id,
    status: "Queued",
  };

  logger.info({ response }, "Generation create response");

  return response;
};

const withDatabaseRetry = async <T>(operation: () => Promise<T>, label: string) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= databaseAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryablePrismaConnectionError(error) || attempt === databaseAttempts) {
        break;
      }

      logger.warn(
        {
          attempt,
          error,
          label,
          nextAttemptInMs: databaseRetryDelayMs,
        },
        "Retrying generation database operation after connection error",
      );

      await delay(databaseRetryDelayMs);
    }
  }

  throw lastError;
};

const isRetryablePrismaConnectionError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && ["P1001", "P1017", "P2024"].includes(error.code);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getGenerationJobStatus = async (id: string) => {
  if (!uuidPattern.test(id)) {
    throw new AppError("Invalid generation job id", 400);
  }

  const job = await findGenerationJobById(id);

  if (!job) {
    throw new AppError("Generation job not found", 404);
  }

  return {
    aspectRatio: job.aspectRatio,
    createdAt: job.createdAt,
    errorMessage: job.errorMessage,
    generatedImageUrls: job.generatedImages.map((image) => image.secureUrl),
    generatedImages: job.generatedImages.map((image) => ({
      height: image.height,
      id: image.id,
      seed: image.seed,
      url: image.secureUrl,
      width: image.width,
    })),
    id: job.id,
    model: job.model,
    numberOfImages: job.numberOfImages,
    progress: job.progress,
    prompt: job.prompt,
    provider: job.provider,
    seeds: job.seeds,
    status: job.status,
    theme: job.theme,
    updatedAt: job.updatedAt,
  };
};

const validateUploadId = (value: unknown, fieldName: string) => {
  if (typeof value !== "string" || !uuidPattern.test(value)) {
    logger.warn({ fieldName, value }, "Generation validation failed: invalid upload id");
    throw new AppError(`${fieldName} must be a valid upload id`, 400);
  }

  return value;
};

const validateAspectRatio = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return "3:4";
  }

  if (typeof value !== "string" || !validAspectRatios.has(value)) {
    logger.warn({ allowed: [...validAspectRatios], value }, "Generation validation failed: invalid aspect ratio");
    throw new AppError(`aspectRatio must be one of: ${[...validAspectRatios].join(", ")}`, 400);
  }

  return value;
};

const validateOptionalString = (value: unknown, fieldName: string) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    logger.warn({ fieldName, valueType: typeof value }, "Generation validation failed: invalid optional string");
    throw new AppError(`${fieldName} must be a string`, 400);
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const validateNumberOfImages = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return 1;
  }

  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > maxImages) {
    logger.warn({ maxImages, value }, "Generation validation failed: invalid numberOfImages");
    throw new AppError(`numberOfImages must be an integer from 1 to ${maxImages}`, 400);
  }

  return value;
};

const buildSeeds = (seed: unknown, numberOfImages: number) => {
  const baseSeed =
    seed === undefined || seed === null || seed === ""
      ? Math.floor(Math.random() * 1_000_000_000)
      : validateSeed(seed);

  return Array.from({ length: numberOfImages }, (_, index) => baseSeed + index);
};

const validateSeed = (value: unknown) => {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    logger.warn({ value }, "Generation validation failed: invalid seed");
    throw new AppError("seed must be a non-negative integer", 400);
  }

  return value;
};

const validateCloudinaryHttpsUrl = (value: string, fieldName: string) => {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || !url.hostname.endsWith("cloudinary.com")) {
      throw new Error("Upload URL is not a Cloudinary HTTPS URL");
    }
  } catch {
    logger.warn({ fieldName, value }, "Generation validation failed: invalid upload URL");
    throw new AppError(`${fieldName} must reference a valid Cloudinary HTTPS image URL`, 400);
  }
};
