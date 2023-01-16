import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { VideoModel } from "./VideoModel";
import { config } from "../../config/config";

const dbConfig = config.db;

export const sequelize = new Sequelize({
  ...(dbConfig as SequelizeOptions),
  models: [VideoModel],
});
