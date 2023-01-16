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

const DEFAULT_LIMIT = 10;

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
  list: async (limit = DEFAULT_LIMIT) => {
    return Video.findAll({ order: [["createdAt", "DESC"]], limit: limit });
  },

  listPreparingVideo: async (limit = DEFAULT_LIMIT) => {
    return Video.findAll({
      where: { muxAssetStatus: MuxAssetStatus.PREPARING },
      limit: limit,
    });
  },

  get: async (videoId: string) => {
    return Video.findByPk(videoId);
  },

  getByUrl: async (vanityUrl: string) => {
    return Video.findOne({ where: { url: vanityUrl } });
  },

  getBySequenceId: async (sequenceId: string) => {
    return Video.findOne({ where: { sequenceId } });
  },

  getByMuxAssetId: async (muxAssetId: string) => {
    return Video.findOne({ where: { muxAssetId: muxAssetId } });
  },
};
