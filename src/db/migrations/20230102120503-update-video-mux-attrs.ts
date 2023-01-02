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
        queryInterface.addColumn(
          "Videos",
          "muxAssetStatus",
          {
            type: DataType.ENUM("preparing", "error", "ready"),
            allowNull: false,
            defaultValue: "preparing",
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
        queryInterface.removeColumn("Videos", "muxAssetStatus", {
          transaction: t,
        }),
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_Videos_muxAssetStatus";',
          { transaction: t }
        ),
      ]);
    });
  },
};
