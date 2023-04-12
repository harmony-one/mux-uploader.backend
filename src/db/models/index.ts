import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { VideoModel } from "./VideoModel";
import { config } from "../../config/config";
import { UserModel } from "./UserModel";
import { MessageModel } from "./MessageModel";
import { DomainModel } from "./DomainModel";
import { LinkModel } from "./LinkModel";

const dbConfig = config.db;

export const sequelize = new Sequelize({
  ...(dbConfig as SequelizeOptions),
  models: [VideoModel, UserModel, MessageModel, DomainModel, LinkModel],
});

VideoModel.belongsTo(UserModel, { foreignKey: "id" });
DomainModel.hasMany(LinkModel, { foreignKey: "id" });
LinkModel.belongsTo(DomainModel, { foreignKey: "domainId" });
