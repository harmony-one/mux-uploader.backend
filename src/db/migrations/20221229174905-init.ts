import { QueryInterface } from "sequelize";
import { Sequelize, DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.createTable("Videos", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataType.STRING,
      },
      assetId: {
        allowNull: true,
        type: DataType.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataType.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataType.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.dropTable("Videos");
  },
};
