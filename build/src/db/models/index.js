"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Video_1 = require("./Video");
const config_1 = require("../../config");
const dbConfig = config_1.config.db;
exports.sequelize = new sequelize_typescript_1.Sequelize(Object.assign(Object.assign({}, dbConfig), { models: [Video_1.Video] }));
