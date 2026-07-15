import { config } from "../config";
import { generationQueue } from "../queues";

export const checkQueueHealth = async () => {
  if (!config.queueEnabled) {
    return {
      status: "disabled",
    };
  }

  try {
    const client = await generationQueue.client;
    await client.info();

    return {
      status: "ok",
    };
  } catch {
    return {
      status: "error",
    };
  }
};
