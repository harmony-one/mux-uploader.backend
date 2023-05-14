import { sequelize } from "./db/models";
import { httpAPI } from "./httpapi/httpApi";
import { config } from "./config/config";
import { logger } from "./logger";
import { mux } from "./mux";
import http from "http";
import { createWsServer } from "./ws/wsServer";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const testDb = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established");
    return;
  } catch (ex) {
    logger.error("Database connection error", ex);
    await sleep(3000);
    await testDb();
    return;
  }
};

const main = async () => {
  await testDb();
  logger.info(`App runs on: ${config.port}`);

  const server = http.createServer(httpAPI);

  createWsServer(server);

  server.listen(config.port);
  mux.runAssetWatcher();
};

main();

process.on("uncaughtException", (err) => {
  logger.error("uncaughtException", err);
});
