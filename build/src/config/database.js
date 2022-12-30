"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const db = {
    development: {
        username: index_1.config.db.username,
        password: index_1.config.db.password,
        database: index_1.config.db.database,
        host: index_1.config.db.host,
        dialect: index_1.config.db.dialect,
    },
    test: {
        username: index_1.config.db.username,
        password: index_1.config.db.password,
        database: index_1.config.db.database,
        host: index_1.config.db.host,
        dialect: index_1.config.db.dialect,
    },
    production: {
        username: index_1.config.db.username,
        password: index_1.config.db.password,
        database: index_1.config.db.database,
        host: index_1.config.db.host,
        dialect: index_1.config.db.dialect,
    },
};
exports.default = db;
module.exports = db;
