import { sequelize } from "./db/models";
import { httpAPI } from "./httpapi";
import { config } from "./config";
import { logger } from "./logger";

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
  httpAPI.listen(config.port);
};

main();
