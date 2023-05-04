import { QueryInterface } from "sequelize";
import { DataType, Sequelize } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Widgets", "html", {
          transaction: t,
        }),
        queryInterface.addColumn(
          "Widgets",
          "attributes",
          {
            type: DataType.JSONB,
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
        queryInterface.removeColumn("Widgets", "attributes", {
          transaction: t,
        }),
        queryInterface.addColumn(
          "Widgets",
          "html",
          {
            type: DataType.TEXT,
            allowNull: false,
            defaultValue: "",
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
