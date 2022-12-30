"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const models_1 = require("./db/models");
const httpapi_1 = require("./httpapi");
const config_1 = require("./config");
const logger_1 = require("./logger");
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const testDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.sequelize.authenticate();
        logger_1.logger.info("Database connection established");
    }
    catch (ex) {
        logger_1.logger.error("Database connection error", ex);
        yield (0, exports.sleep)(3000);
        yield testDb();
        return;
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb();
    logger_1.logger.info(`App runs on: ${config_1.config.port}`);
    httpapi_1.httpAPI.listen(config_1.config.port);
});
main();
