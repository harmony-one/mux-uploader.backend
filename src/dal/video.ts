import { Video } from "../db/models/Video";

interface CreateVideoAttr {
  id: string;
  assetId: string;
  awsURL: string;
  awsKey: string;
}

export const VideoDAL = {
  createVideo: async (params: CreateVideoAttr) => {
    const video = await Video.create({
      id: params.id,
      assetId: params.assetId,
      awsKey: params.awsKey,
      awsURL: params.awsURL,
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
