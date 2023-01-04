import { Request, Response } from "express";
import { VideoDAL } from "../../dal/video";

export const videoListRoute = async (req: Request, res: Response) => {
  const videoList = await VideoDAL.list();

  res.json({ data: videoList });
};
