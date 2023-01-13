import { config } from "./config";

const db = {
  development: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    dialect: config.db.dialect,
  },
  test: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    dialect: config.db.dialect,
  },
  production: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    dialect: config.db.dialect,
  },
};

export default db;

module.exports = db;
