import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { uploadRoute, uploadRouteValidators } from "./upload/uploadRoute";
import { videoListRoute } from "./video/videoListRoute";
import { videoMuxAssetRoute, videoRoute } from "./video/videoRoute";
import { logger } from "../logger";
import { muxWebhook } from "./webhooks/muxWebhook";

export const httpAPI = express();
httpAPI.use(cors());

httpAPI.post(
  "/webhooks/mux",
  bodyParser.raw({ type: "application/json" }),
  muxWebhook
);

httpAPI.use(bodyParser.json());

httpAPI.get("/", (req, res) => {
  return res.json({ ok: true });
});
httpAPI.post("/upload", fileUpload(), uploadRouteValidators, uploadRoute);
httpAPI.get("/videos", videoListRoute);
httpAPI.get("/videos/:videoId", videoRoute);
httpAPI.get("/videos/:videoId/muxAsset", videoMuxAssetRoute);

httpAPI.use((req: Request, res: Response) => {
  return res.sendStatus(404);
});

httpAPI.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error("error handler", err);
  return res.status(500).send("Something wrong!");
});