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
exports.uploadRoute = void 0;
const uuid_1 = require("uuid");
const aws_1 = require("../../aws");
const mux_1 = require("../../mux");
const video_1 = require("../../dal/video");
const uploadRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || !req.files.video) {
        return res.json({ files: Object.keys(req.files || {}) });
    }
    const file = req.files.video;
    const id = (0, uuid_1.v4)();
    const ext = file.name.split(".").pop();
    const key = id + "." + ext;
    const sendData = yield aws_1.s3Api.uploadFile(file.data, id + "." + ext);
    const asset = yield mux_1.mux.createAsset(id, sendData.Location);
    yield video_1.VideoDAL.createVideo(id, asset.id);
    return res.json({
        result: "ok",
        id: id,
        key: key,
        awsUrl: sendData.Location,
    });
});
exports.uploadRoute = uploadRoute;
