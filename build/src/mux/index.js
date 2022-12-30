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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mux = void 0;
const mux_node_1 = __importDefault(require("@mux/mux-node"));
const config_1 = require("../config");
const { Video } = new mux_node_1.default(config_1.config.mux.tokenId, config_1.config.mux.tokenSecret);
exports.mux = {
    createAsset: (name, sourceUrl) => __awaiter(void 0, void 0, void 0, function* () {
        const asset = yield Video.Assets.create({
            input: sourceUrl,
            playback_policy: "public",
        });
        return asset;
    }),
};
