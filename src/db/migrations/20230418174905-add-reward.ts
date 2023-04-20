import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Rewards", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataType.STRING,
      },
      data: {
        allowNull: false,
        type: DataType.JSONB,
      },
      status: {
        allowNull: false,
        type: DataType.STRING,
      },
      transactionHash: {
        allowNull: true,
        type: DataType.STRING,
      },
      destinationAddress: {
        allowNull: false,
        type: DataType.STRING,
      },
      amount: {
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
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Rewards");
  },
};
