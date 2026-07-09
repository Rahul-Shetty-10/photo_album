import { env } from "./env";

export const config = {
  apiVersion: env.API_VERSION,
  appVersion: env.APP_VERSION,
  corsOrigin: env.CORS_ORIGIN,
  databaseUrl: env.DATABASE_URL,
  logLevel: env.LOG_LEVEL,
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
} as const;
