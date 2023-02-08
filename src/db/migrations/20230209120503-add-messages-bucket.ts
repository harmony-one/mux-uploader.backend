import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "Messages",
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataType.STRING,
          },
          content: {
            allowNull: false,
            type: DataType.JSONB,
          },
          domain: {
            allowNull: false,
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
        },
        { transaction: t }
      );

      await queryInterface.addIndex("Messages", ["domain"], {
        name: "idx_domain",
        transaction: t,
      });
    });
  },
  async down(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.dropTable("Messages", { transaction: t });
    });
  },
};
