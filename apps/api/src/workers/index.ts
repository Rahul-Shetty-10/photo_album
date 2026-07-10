import type { Worker } from "bullmq";

import { createGenerationWorker } from "./generation.worker";

export const startWorkers = () => {
  const workers: Worker[] = [createGenerationWorker()];

  return {
    close: async () => {
      await Promise.all(workers.map((worker) => worker.close()));
    },
  };
};
