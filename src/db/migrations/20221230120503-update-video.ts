import { QueryInterface } from "sequelize";
import { Sequelize, DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Videos",
          "awsURL",
          {
            type: DataType.STRING,
            allowNull: true,
            defaultValue: "",
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Videos",
          "awsKey",
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
        queryInterface.removeColumn("Videos", "awsURL", {
          transaction: t,
        }),
        queryInterface.removeColumn("Videos", "awsKey", {
          transaction: t,
        }),
      ]);
    });
  },
};
