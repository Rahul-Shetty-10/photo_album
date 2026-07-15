import { Queue } from "bullmq";

import { config } from "../config";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";
import { isRedisRequestLimitError, queueConnection } from "./config";

export type GenerationQueueJobData = {
  jobId: string;
};

export const generationQueueName = "generation";

export const generationQueue = new Queue<GenerationQueueJobData>(generationQueueName, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      delay: 30_000,
      type: "exponential",
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const enqueueGenerationJob = async (jobId: string) => {
  if (!config.queueEnabled) {
    throw new AppError("Image generation queue is currently disabled", 503);
  }

  try {
    return await generationQueue.add(
      "process-generation-job",
      {
        jobId,
      },
      {
        jobId,
      },
    );
  } catch (error) {
    if (isRedisRequestLimitError(error)) {
      logger.error({ error, jobId }, "Redis request limit exceeded while enqueueing GenerationJob");
      throw new AppError("Image generation queue is temporarily unavailable. Redis request limit exceeded.", 503);
    }

    throw error;
  }
};
