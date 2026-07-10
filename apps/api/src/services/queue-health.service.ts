import { generationQueue } from "../queues";

export const checkQueueHealth = async () => {
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
