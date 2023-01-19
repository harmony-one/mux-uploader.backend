import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Videos",
          "ownerId",
          {
            type: DataType.STRING,
            allowNull: true,
            // references: {
            //   model: "Users",
            //   key: "id",
            // },
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
  async down(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Videos", "ownerId", {
          transaction: t,
        }),
      ]);
    });
  },
};
