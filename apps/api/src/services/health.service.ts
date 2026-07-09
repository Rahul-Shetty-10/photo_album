import { config } from "../config";

export const getHealthStatus = () => ({
  status: "ok",
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  environment: config.nodeEnv,
  version: config.appVersion,
});
