import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { VideoModel } from "./VideoModel";
import { config } from "../../config/config";
import { UserModel } from "./UserModel";

const dbConfig = config.db;

export const sequelize = new Sequelize({
  ...(dbConfig as SequelizeOptions),
  models: [VideoModel, UserModel],
});
