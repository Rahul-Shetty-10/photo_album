import { config } from "../config";
import { prisma } from "../database";
import { generatorService } from "../ai/generator.service";
import { checkQueueHealth } from "./queue-health.service";

export const getHealthStatus = async () => {
  const [database, queue, generator] = await Promise.all([
    checkDatabase(),
    checkQueueHealth(),
    generatorService.healthCheck(),
  ]);
  const status =
    database.status === "ok" && queue.status === "ok" && generator.status === "ok" ? "ok" : "degraded";

  return {
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: config.appVersion,
    database,
    queue,
    generator,
  };
};

const checkDatabase = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
    };
  } catch {
    return {
      status: "error",
    };
  }
};
