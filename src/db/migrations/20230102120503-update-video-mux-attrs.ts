import { QueryInterface } from "sequelize";
import { Sequelize, DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn("Videos", "assetId", "muxAssetId", {
          transaction: t,
        }),
        queryInterface.addColumn(
          "Videos",
          "muxPlaybackId",
          {
            type: DataType.STRING,
            allowNull: true,
            defaultValue: "",
          },
          { transaction: t }
        ),
      ]);
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn("Videos", "muxAssetId", "assetId", {
          transaction: t,
        }),
        queryInterface.removeColumn("Videos", "muxPlaybackId", {
          transaction: t,
        }),
      ]);
    });
  },
};
