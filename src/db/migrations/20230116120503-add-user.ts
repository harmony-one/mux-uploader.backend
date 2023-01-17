import { QueryInterface } from "sequelize";
import { DataType, Sequelize } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          "Users",
          {
            id: {
              allowNull: false,
              primaryKey: true,
              type: DataType.STRING,
            },
            address: {
              allowNull: false,
              type: DataType.STRING,
            },
            nonce: {
              allowNull: false,
              type: DataType.INTEGER,
            },
            createdAt: {
              allowNull: false,
              type: DataType.DATE,
            },
            updatedAt: {
              allowNull: false,
              type: DataType.DATE,
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable("Users", {
          transaction: t,
        }),
      ]);
    });
  },
};
