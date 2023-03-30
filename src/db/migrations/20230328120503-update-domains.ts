import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        "Domains",
        "bgColor",
        {
          type: DataType.STRING,
          allowNull: true,
          defaultValue: "",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Domains",
        "owner",
        {
          type: DataType.STRING,
          allowNull: true,
          defaultValue: "",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Domains",
        "referral",
        {
          type: DataType.STRING,
          allowNull: true,
          defaultValue: "",
        },
        { transaction: t }
      );
    });
  },
  async down(queryInterface: QueryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("Domains", "bgColor", {
        transaction: t,
      });
      await queryInterface.removeColumn("Domains", "owner", { transaction: t });
    });
  },
};
