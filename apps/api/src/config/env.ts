import { config as loadEnv } from "dotenv";
import path from "node:path";

import { z } from "zod";

loadEnv();
loadEnv({ path: path.resolve(process.cwd(), "apps/api/.env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: false });

const envSchema = z.object({
  API_VERSION: z.string().min(1).default("v1"),
  APP_VERSION: z.string().min(1).default(process.env.npm_package_version ?? "0.0.1"),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CORS_ORIGIN: z.string().min(1).default("*"),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_IMAGE_MODEL: z.string().min(1).default("gpt-image-1"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  UPSTASH_REDIS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
