import { config } from "../config";
import { prisma } from "../database";

export const getHealthStatus = async () => {
  const database = await checkDatabase();
  const status = database.status === "ok" ? "ok" : "degraded";

  return {
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: config.appVersion,
    database,
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
