import { Router, Request, Response } from "express";
import { VideoDAL } from "../../dal/VideoDAL";
import { UserDAL } from "../../dal/UserDAL";

export const addressRouter = Router();

addressRouter.get(
  "/:address/videos/:url",
  async (req: Request, res: Response) => {
    const user = await UserDAL.getByAddress(req.params.address);

    if (!user) {
      return res.sendStatus(404);
    }

    try {
      const videoList = await VideoDAL.getUserVideoByURL(
        user.id,
        req.params.url
      );

      return res.json({
        data: videoList,
      });
    } catch (ex) {
      return res.sendStatus(500);
    }
  }
);

addressRouter.get("/:address/videos", async (req: Request, res: Response) => {
  try {
    const user = await UserDAL.getByAddress(req.params.address);

    if (!user) {
      return res.sendStatus(404);
    }

    const videoList = await VideoDAL.getUserVideoList(user.id);

    return res.json({
      data: videoList,
    });
  } catch (ex) {
    return res.sendStatus(500);
  }
});
