"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Api = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = require("../config");
const s3 = new aws_sdk_1.default.S3({
    region: config_1.config.aws.s3.region,
    credentials: {
        accessKeyId: config_1.config.aws.s3.accessKeyId,
        secretAccessKey: config_1.config.aws.s3.secretAccessKey,
    },
});
exports.s3Api = {
    uploadFile: (data, uuid) => {
        return s3
            .upload({
            ACL: "public-read",
            Bucket: config_1.config.aws.s3.bucket,
            Key: uuid,
            Body: data,
        })
            .promise();
    },
};
