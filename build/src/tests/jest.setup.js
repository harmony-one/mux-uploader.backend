"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
if (config_1.config.appEnv !== config_1.AppEnv.TEST) {
    throw new Error(`Wrong env for test env: ${config_1.config.appEnv}`);
}
