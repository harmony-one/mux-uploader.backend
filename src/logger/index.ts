import winston from "winston";

export const watcherLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "./logs/wallets.watcher.log" }),
  ],
});

export const createBitcoinTxLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "./logs/createBitcoinTx.log" }),
  ],
});
