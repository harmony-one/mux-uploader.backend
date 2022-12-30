"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.AppEnv = void 0;
require("dotenv/config");
var AppEnv;
(function (AppEnv) {
    AppEnv["PRODUCTION"] = "production";
    AppEnv["TEST"] = "test";
    AppEnv["DEVELOPMENT"] = "development";
})(AppEnv = exports.AppEnv || (exports.AppEnv = {}));
function getAppEnv(envStr) {
    const env = envStr;
    if (env === AppEnv.TEST ||
        env === AppEnv.DEVELOPMENT ||
        env === AppEnv.PRODUCTION) {
        return env;
    }
    throw new Error(`APP_ENV is invalid: ${env}`);
}
exports.config = {
    appEnv: getAppEnv(process.env.APP_ENV),
    port: parseInt(process.env.PORT || "3001", 10),
    db: {
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
        host: process.env.DB_HOST || "",
        dialect: "postgres",
    },
    aws: {
        s3: {
            region: process.env.S3_REGION || "",
            bucket: process.env.S3_BUCKET || "",
            accessKeyId: process.env.S3_ACCESS_KEY || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
    },
    mux: {
        tokenId: process.env.MUX_TOKEN_ID || "",
        tokenSecret: process.env.MUX_TOKEN_SECRET || "",
    },
};
