import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Video } from "./Video";
import { config } from "../../config/config";

const dbConfig = config.db;

export const sequelize = new Sequelize({
  ...(dbConfig as SequelizeOptions),
  models: [Video],
});
