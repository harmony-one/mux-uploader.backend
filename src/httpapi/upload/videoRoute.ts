import { Request, Response } from "express";
import { VideoDAL } from "../../dal/video";

export const videoRoute = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const video = await VideoDAL.get(videoId);

  res.json({ data: video });
};
