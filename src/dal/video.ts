import { Video } from "../db/models/Video";

export const VideoDAL = {
  createVideo: async (uuid: string, assetId: string) => {
    const video = await Video.create({
      id: uuid,
      assetId: assetId,
    });

    return video;
  },
  list: async () => {
    return Video.findAll();
  },
  get: async (videoId: string) => {
    return Video.findByPk(videoId);
  },
};
