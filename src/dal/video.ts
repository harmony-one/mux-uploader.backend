import { MuxAssetStatus, Video } from "../db/models/Video";

interface CreateVideoAttr {
  id: string;
  muxAssetId: string;
  awsURL: string;
  awsKey: string;
  name: string;
  description: string;
  url: string;
}

export const VideoDAL = {
  createVideo: async (params: CreateVideoAttr) => {
    return Video.create({
      id: params.id,
      muxAssetStatus: MuxAssetStatus.PREPARING,
      muxAssetId: params.muxAssetId,
      awsKey: params.awsKey,
      awsURL: params.awsURL,
      name: params.name,
      description: params.description,
      url: params.url,
    });
  },
  list: async () => {
    return Video.findAll({ order: [["createdAt", "DESC"]] });
  },

  listPreparingVideo: async () => {
    return Video.findAll({
      where: { muxAssetStatus: MuxAssetStatus.PREPARING },
      limit: 10,
    });
  },

  get: async (videoId: string) => {
    return Video.findByPk(videoId);
  },

  getByMuxAssetId: async (muxAssetId: string) => {
    return Video.findOne({ where: { muxAssetId: muxAssetId } });
  },
};
