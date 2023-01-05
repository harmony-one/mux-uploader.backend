import winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "./logs/app.log",
      maxFiles: 5,
      maxsize: 1000000,
    }),
    new winston.transports.Console(),
  ],
});
