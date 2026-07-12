import type { Server } from "node:http";

import { createApp } from "./app";
import { config } from "./config";
import { logger } from "./utils/logger";
import { startWorkers } from "./workers";

const app = createApp();
const workers = startWorkers();

const server = app.listen(config.port, () => {
  logger.info(
    {
      environment: config.nodeEnv,
      port: config.port,
    },
    "ALANKAR API started",
  );
});

const shutdown = (signal: NodeJS.Signals, activeServer: Server) => {
  logger.info({ signal }, "Shutdown signal received");

  activeServer.close(async (error) => {
    if (error) {
      logger.error({ error }, "Error during shutdown");
      process.exit(1);
    }

    await workers.close();

    logger.info("ALANKAR API stopped");
    process.exit(0);
  });
};

process.on("SIGINT", (signal) => shutdown(signal, server));
process.on("SIGTERM", (signal) => shutdown(signal, server));

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
  shutdown("SIGTERM", server);
});

process.on("uncaughtException", (error) => {
  logger.fatal({ error }, "Uncaught exception");
  shutdown("SIGTERM", server);
});
