import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  API_VERSION: z.string().min(1).default("v1"),
  APP_VERSION: z.string().min(1).default(process.env.npm_package_version ?? "0.0.1"),
  CORS_ORIGIN: z.string().min(1).default("*"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
