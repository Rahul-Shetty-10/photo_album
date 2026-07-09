import { env } from "./env";

export const config = {
  apiVersion: env.API_VERSION,
  appVersion: env.APP_VERSION,
  corsOrigin: env.CORS_ORIGIN,
  logLevel: env.LOG_LEVEL,
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
} as const;
