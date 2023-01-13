import { Request, Response } from "express";
import { VideoDAL } from "../../dal/video";
import { mux } from "../../mux";

export const videoByIdRoute = async (req: Request, res: Response) => {
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

export const videoByUrlRoute = async (req: Request, res: Response) => {
  const { vanityUrl } = req.params;
  const video = await VideoDAL.getByUrl(vanityUrl);

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

export const videoBySequenceIdRoute = async (req: Request, res: Response) => {
  const { sequenceId } = req.params;
  const video = await VideoDAL.getBySequenceId(sequenceId);

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
