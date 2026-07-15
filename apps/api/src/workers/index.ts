import type { Worker } from "bullmq";

import { config } from "../config";
import { isRedisRequestLimitError } from "../queues/config";
import { logger } from "../utils/logger";
import { createGenerationWorker } from "./generation.worker";

export const startWorkers = () => {
  if (!config.queueEnabled) {
    logger.warn("Queue workers disabled by QUEUE_ENABLED=false");

    return {
      close: async () => undefined,
    };
  }

  const workers: Worker[] = [createGenerationWorker()];

  for (const worker of workers) {
    worker.on("error", (error) => {
      if (!isRedisRequestLimitError(error)) {
        logger.error({ error, workerName: worker.name }, "Queue worker error");
        return;
      }

      logger.error({ error, workerName: worker.name }, "Redis request limit exceeded; closing queue worker");
      void worker.close(true).catch((closeError: unknown) => {
        logger.error({ closeError, workerName: worker.name }, "Failed to close queue worker after Redis limit error");
      });
    });
  }

  return {
    close: async () => {
      await Promise.all(workers.map((worker) => worker.close()));
    },
  };
};
