import express from "express";
import fileUpload from "express-fileupload";
import { uploadRoute } from "./upload/uploadRoute";
import { videoListRoute } from "./upload/videoListRoute";
import { videoRoute } from "./upload/videoRoute";

export const httpAPI = express();

httpAPI.use(fileUpload());
httpAPI.get("/", (req, res) => {
  return res.json({ ok: true });
});
httpAPI.post("/upload", uploadRoute);

httpAPI.get("/videos", videoListRoute);
httpAPI.get("/videos/:videoId", videoRoute);
