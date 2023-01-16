import { QueryInterface } from "sequelize";
import { DataType, Sequelize } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.sequelize.query("CREATE SEQUENCE video_sequence", {
          transaction: t,
        }),
        queryInterface.addColumn(
          "Videos",
          "sequenceId",
          {
            type: DataType.INTEGER,
            allowNull: false,
            unique: true,
            defaultValue: queryInterface.sequelize.literal(
              "nextval('video_sequence')"
            ),
          },
          { transaction: t }
        ),
      ]);
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Videos", "sequenceId", {
          transaction: t,
        }),
        queryInterface.sequelize.query("DROP SEQUENCE video_sequence", {
          transaction: t,
        }),
      ]);
    });
  },
};
