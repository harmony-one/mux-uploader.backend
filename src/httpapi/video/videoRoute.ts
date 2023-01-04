import { Request, Response } from "express";
import { VideoDAL } from "../../dal/video";
import { mux } from "../../mux";

export const videoRoute = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const video = await VideoDAL.get(videoId);

  if (!video || !video.muxAssetId) {
    return res.sendStatus(404);
  }

  const muxAsset = await mux.loadAsset(video.muxAssetId);

  const data = {
    ...video.toJSON(),
    muxAsset,
  };

  return res.json({ data: data });
};

export const videoMuxAssetRoute = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const video = await VideoDAL.get(videoId);

  if (!video || !video.muxAssetId) {
    return res.sendStatus(404);
  }

  const asset = await mux.loadAsset(video.muxAssetId);

  return res.json({ data: asset });
};
