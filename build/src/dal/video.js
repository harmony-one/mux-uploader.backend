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
exports.VideoDAL = void 0;
const Video_1 = require("../db/models/Video");
exports.VideoDAL = {
    createVideo: (uuid, assetId) => __awaiter(void 0, void 0, void 0, function* () {
        const video = yield Video_1.Video.create({
            id: uuid,
            assetId: assetId,
        });
        return video;
    }),
    list: () => __awaiter(void 0, void 0, void 0, function* () {
        return Video_1.Video.findAll();
    }),
    get: (videoId) => __awaiter(void 0, void 0, void 0, function* () {
        return Video_1.Video.findByPk(videoId);
    }),
};
