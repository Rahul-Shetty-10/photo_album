import type { RedisOptions } from "bullmq";

import { config } from "../config";

const redisUrl = new URL(config.upstashRedisUrl);

export const queueConnection: RedisOptions = {
  db: redisUrl.pathname.length > 1 ? Number(redisUrl.pathname.slice(1)) : 0,
  host: redisUrl.hostname,
  maxRetriesPerRequest: null,
  password: redisUrl.password || undefined,
  port: redisUrl.port ? Number(redisUrl.port) : 6379,
  tls: redisUrl.protocol === "rediss:" ? {} : undefined,
  username: redisUrl.username || undefined,
};

export const isRedisRequestLimitError = (error: unknown) =>
  error instanceof Error && error.message.toLowerCase().includes("max requests limit exceeded");
