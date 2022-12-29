import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import databaseConfigs from "../../config/database.json";
import { Video } from "./Video";
import { config } from "../../config";

const dbConfig = databaseConfigs[config.appEnv];

export const sequelize = new Sequelize({
  ...(dbConfig as SequelizeOptions),
  models: [Video],
});
