import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { uploadRouter } from "./upload/uploadRouter";
import { videoListRoute } from "./video/videoListRoute";
import {
  videoBySequenceIdRoute,
  videoByUrlRoute,
  videoMuxAssetRoute,
  videoByIdRoute,
} from "./video/videoRoute";
import { logger } from "../logger";
import { muxWebhook } from "./webhooks/muxWebhook";
import { authWeb3Router } from "./auth/authWeb3Router";
import { passportMiddleware } from "./passport";
import fileUpload from "express-fileupload";
import { addressRouter } from "./address/addressRouter";
import { messagesRouter } from "./messages/messagesRouter";
import { sequelize } from "../db/models";
import { domainsRouter } from "./domain/domainRouter";
import { ratesRouter } from "./rates/ratesRoute";
import { linkRouter } from "./link/linkRouter";
import { rewardRouter } from "./reward/rewardRouter";
import { translationRoute } from "./translation/translationRoute";
import { widgetRouter } from "./widget/widgetRouter";

export const httpAPI = express();
httpAPI.use(cors());

httpAPI.post(
  "/webhooks/mux",
  bodyParser.raw({ type: "application/json" }),
  muxWebhook
);

httpAPI.use(bodyParser.json());
httpAPI.use(fileUpload());
httpAPI.use(passportMiddleware.initialize());

httpAPI.get("/", (req, res) => {
  return res.json({ ok: true });
});

httpAPI.use("/", uploadRouter);
httpAPI.get("/videos", videoListRoute);
httpAPI.get("/videos/url/:vanityUrl", videoByUrlRoute);
httpAPI.get("/videos/bySequenceId/:sequenceId", videoBySequenceIdRoute);
httpAPI.get("/videos/:videoId", videoByIdRoute);
httpAPI.get("/videos/:videoId/muxAsset", videoMuxAssetRoute);
httpAPI.use("/address", addressRouter);
httpAPI.use("/auth/web3", authWeb3Router);
httpAPI.use("/messages", messagesRouter);
httpAPI.use("/domains", domainsRouter);
httpAPI.use("/rates", ratesRouter);
httpAPI.use("/links", linkRouter);
httpAPI.use("/rewards", rewardRouter);
httpAPI.use("/translations", translationRoute);
httpAPI.use("/widgets", widgetRouter);

httpAPI.use("/_health", async (req, res) => {
  const dbConnection = await sequelize
    .authenticate()
    .then(() => true)
    .catch(() => false);
  const data = {
    uptime: Math.round(process.uptime()),
    dbConnection,
    message: "ok",
    timestamp: Math.round(Date.now() / 1000),
  };

  res.status(200).send(data);
});

httpAPI.use((req: Request, res: Response) => {
  return res.sendStatus(404);
});

httpAPI.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error("error handler", err);
  return res.status(500).send("Something wrong!");
});
