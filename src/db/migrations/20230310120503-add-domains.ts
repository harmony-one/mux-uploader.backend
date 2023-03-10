import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "Domains",
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataType.STRING,
          },
          domain: {
            allowNull: false,
            type: DataType.STRING,
          },
          createdTxHash: {
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

      await queryInterface.addIndex("Domains", ["domain"], {
        name: "Domains_idx_domain",
        unique: true,
        transaction: t,
      });
    });
  },
  async down(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.dropTable("Domains", { transaction: t });
    });
  },
};
