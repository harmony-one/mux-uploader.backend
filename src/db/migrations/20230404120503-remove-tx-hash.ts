import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("Domains", "createdTxHash", {
        transaction: t,
      });
    });
  },
  async down(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        "Domains",
        "createdTxHash",
        {
          type: DataType.STRING,
          allowNull: false,
          defaultValue: "",
        },
        { transaction: t }
      );
    });
  },
};
