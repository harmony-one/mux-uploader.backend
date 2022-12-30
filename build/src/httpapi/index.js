"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAPI = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const uploadRoute_1 = require("./upload/uploadRoute");
const videoListRoute_1 = require("./upload/videoListRoute");
const videoRoute_1 = require("./upload/videoRoute");
exports.httpAPI = (0, express_1.default)();
exports.httpAPI.use((0, express_fileupload_1.default)());
exports.httpAPI.get("/", (req, res) => {
    return res.json({ ok: true });
});
exports.httpAPI.post("/upload", uploadRoute_1.uploadRoute);
exports.httpAPI.get("/videos", videoListRoute_1.videoListRoute);
exports.httpAPI.get("/videos/:videoId", videoRoute_1.videoRoute);
