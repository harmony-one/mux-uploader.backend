import { sequelize } from "./db/models";
import { httpAPI } from "./httpapi";

const main = async () => {
  await sequelize.authenticate();
  httpAPI.listen(3333);
};

main();
