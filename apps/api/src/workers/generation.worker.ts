import { Worker } from "bullmq";

import { generatorService } from "../ai/generator.service";
import {
  createGeneratedImage,
  findGenerationJobById,
  updateGenerationJob,
} from "../repositories/generation-job.repository";
import { queueConnection } from "../queues/config";
import { type GenerationQueueJobData, generationQueueName } from "../queues/generation.queue";
import { uploadImageUrl } from "../storage";
import { logger } from "../utils/logger";

export const createGenerationWorker = () =>
  new Worker<GenerationQueueJobData>(
    generationQueueName,
    async (job) => {
      const { jobId } = job.data;

      logger.info({ attemptsMade: job.attemptsMade, bullJobId: job.id, jobId }, "Worker start for GenerationJob");

      await updateGenerationJob(jobId, {
        errorMessage: null,
        progress: 5,
        startedAt: new Date(),
        status: "Running",
      });

      try {
        const generationJob = await findGenerationJobById(jobId);

        if (!generationJob) {
          throw new Error(`GenerationJob ${jobId} not found`);
        }

        const existingSeeds = new Set(generationJob.generatedImages.map((image) => image.seed).filter(Boolean));
        const seedsToGenerate = generationJob.seeds.filter((seed) => !existingSeeds.has(seed));

        logger.info(
          {
            brideImageUrl: generationJob.brideUpload.secureUrl,
            groomImageUrl: generationJob.groomUpload.secureUrl,
            jobId,
            numberOfImages: generationJob.numberOfImages,
            seedsToGenerate,
          },
          "GenerationJob loaded for worker",
        );

        for (const [index, seed] of seedsToGenerate.entries()) {
          logger.info({ jobId, seed }, "Starting provider generation");
          const generatedImage = await generatorService.generateWeddingImage({
            aspectRatio: generationJob.aspectRatio,
            brideImageUrl: generationJob.brideUpload.secureUrl,
            groomImageUrl: generationJob.groomUpload.secureUrl,
            prompt: generationJob.prompt,
            seed,
          });

          logger.info({ generatedImage, jobId, seed }, "Provider generation completed");

          logger.info({ sourceUrl: generatedImage.url, jobId, seed }, "Uploading generated image to Cloudinary");
          const cloudinaryImage = await uploadImageUrl(generatedImage.url);
          logger.info({ cloudinaryImage, jobId, seed }, "Cloudinary upload completed");

          await createGeneratedImage({
            height: cloudinaryImage.height || generatedImage.height,
            jobId,
            publicId: cloudinaryImage.publicId,
            secureUrl: cloudinaryImage.secureUrl,
            seed: generatedImage.seed,
            width: cloudinaryImage.width || generatedImage.width,
          });
          logger.info({ jobId, seed, secureUrl: cloudinaryImage.secureUrl }, "Generated image persisted");

          const completedCount = generationJob.generatedImages.length + index + 1;
          const progress = Math.min(95, 5 + Math.round((completedCount / generationJob.numberOfImages) * 90));

          await updateGenerationJob(jobId, {
            progress,
            status: "Running",
          });
          logger.info({ jobId, progress, status: "Running" }, "GenerationJob progress updated");
        }

        await updateGenerationJob(jobId, {
          completedAt: new Date(),
          progress: 100,
          status: "Completed",
        });
        logger.info({ jobId, progress: 100, status: "Completed" }, "GenerationJob completed");
      } catch (error) {
        const message = getGenerationErrorMessage(error);
        const errorStatus = getGenerationErrorStatus(error);
        const isProviderError = error instanceof Error && error.name.endsWith("ProviderError");
        const isNonRetryable = isProviderError || errorStatus === 401 || errorStatus === 402 || errorStatus === 403;
        const isFinalAttempt = isNonRetryable || job.attemptsMade + 1 >= (job.opts.attempts ?? 1);

        await updateGenerationJob(jobId, {
          errorMessage: message,
          failedAt: isFinalAttempt ? new Date() : undefined,
          progress: isFinalAttempt ? 100 : 5,
          status: isFinalAttempt ? "Failed" : "Queued",
        });

        logger.error({ error, isFinalAttempt, isNonRetryable, jobId, message }, "GenerationJob failed");

        if (isNonRetryable) {
          return;
        }

        throw error;
      }
    },
    {
      connection: queueConnection,
      concurrency: 2,
      lockDuration: 10 * 60 * 1000,
    },
  );

const getGenerationErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "body" in error) {
    const body = (error as { body?: unknown }).body;

    if (typeof body === "object" && body !== null && "detail" in body) {
      const detail = (body as { detail?: unknown }).detail;

      if (typeof detail === "string" && detail.trim().length > 0) {
        return detail;
      }
    }
  }

  return error instanceof Error ? error.message : "Generation failed";
};

const getGenerationErrorStatus = (error: unknown) => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }

  return undefined;
};
