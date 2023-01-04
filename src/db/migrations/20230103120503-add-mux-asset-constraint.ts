import { QueryInterface } from "sequelize";
import { Sequelize } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addConstraint("Videos", {
          type: "unique",
          name: "uniq_muxAssetId",
          fields: ["muxAssetId"],
          transaction: t,
        }),
      ]);
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint("Videos", "uniq_muxAssetId", {
          transaction: t,
        }),
      ]);
    });
  },
};
