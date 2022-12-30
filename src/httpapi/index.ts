import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { uploadRoute } from "./upload/uploadRoute";
import { videoListRoute } from "./upload/videoListRoute";
import { videoMuxAssetRoute, videoRoute } from "./upload/videoRoute";

export const httpAPI = express();
httpAPI.use(cors());

httpAPI.use(fileUpload());
httpAPI.get("/", (req, res) => {
  return res.json({ ok: true });
});
httpAPI.post("/upload", uploadRoute);

httpAPI.get("/videos", videoListRoute);
httpAPI.get("/videos/:videoId", videoRoute);
httpAPI.get("/videos/:videoId/muxAsset", videoMuxAssetRoute);
