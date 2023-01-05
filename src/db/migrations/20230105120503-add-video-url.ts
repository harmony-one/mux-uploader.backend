import { QueryInterface } from "sequelize";
import { DataType, Sequelize } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Videos",
          "url",
          {
            type: DataType.STRING,
            allowNull: false,
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
        queryInterface.removeColumn("Videos", "url", {
          transaction: t,
        }),
      ]);
    });
  },
};
