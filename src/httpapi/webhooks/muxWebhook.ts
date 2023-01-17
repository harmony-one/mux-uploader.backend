import { Request, Response } from "express";
import Mux from "@mux/mux-node";
import { config } from "../../config/config";
import {
  MuxEventName,
  MuxEvents,
  MuxEventVideoAssetReady,
} from "../../mux/muxTypes";
import { logger } from "../../logger";
import { updatePlaybackId } from "../../mux/assetWatcher";
import { VideoDAL } from "../../dal/VideoDAL";

const onAssetReady = async (muxEvent: MuxEventVideoAssetReady) => {
  const video = await VideoDAL.getByMuxAssetId(muxEvent.data.id);

  if (!video) {
    return false;
  }

  return updatePlaybackId(video);
};

const handleEvent = (muxEvent: MuxEvents) => {
  if (muxEvent.type === MuxEventName.VideoAssetReady) {
    return onAssetReady(muxEvent);
  }
  return true;
};

export const muxWebhook = async (req: Request, res: Response) => {
  try {
    const muxSignature = req.headers["mux-signature"];

    if (typeof muxSignature !== "string") {
      throw new Error(`Invalid mux signature header: ${muxSignature}`);
    }

    Mux.Webhooks.verifyHeader(req.body, muxSignature, config.mux.webhookSecret);

    const jsonFormattedBody: MuxEvents = JSON.parse(req.body);

    await handleEvent(jsonFormattedBody);

    res.json({ received: true });
  } catch (err: any) {
    logger.error("muxWebhook err", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
