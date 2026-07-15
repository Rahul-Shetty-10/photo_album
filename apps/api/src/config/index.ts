import { env } from "./env";

export const config = {
  apiVersion: env.API_VERSION,
  appVersion: env.APP_VERSION,
  cloudinary: {
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
  },
  corsOrigin: env.CORS_ORIGIN,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  logLevel: env.LOG_LEVEL,
  nodeEnv: env.NODE_ENV,
  pollinations: {
    apiKey: env.POLLINATIONS_API_KEY,
    imageModel: env.POLLINATIONS_IMAGE_MODEL,
  },
  port: env.PORT,
  queueEnabled: env.QUEUE_ENABLED,
  upstashRedisUrl: env.UPSTASH_REDIS_URL,
} as const;
