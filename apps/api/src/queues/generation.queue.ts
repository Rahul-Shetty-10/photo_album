import { Queue } from "bullmq";

import { queueConnection } from "./config";

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

export const enqueueGenerationJob = async (jobId: string) =>
  generationQueue.add(
    "process-generation-job",
    {
      jobId,
    },
    {
      jobId,
    },
  );
