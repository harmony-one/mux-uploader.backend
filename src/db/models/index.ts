import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { VideoModel } from "./VideoModel";
import { config } from "../../config/config";
import { UserModel } from "./UserModel";
import { MessageModel } from "./MessageModel";
import { DomainModel } from "./DomainModel";

const dbConfig = config.db;

export const sequelize = new Sequelize({
  ...(dbConfig as SequelizeOptions),
  models: [VideoModel, UserModel, MessageModel, DomainModel],
});

VideoModel.belongsTo(UserModel, { foreignKey: "id" });
