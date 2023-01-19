import { MuxAssetStatus, VideoModel } from "../db/models/VideoModel";
import { sequelize } from "../db/models";

interface CreateVideoAttr {
  id: string;
  muxAssetId?: string;
  awsURL?: string;
  awsKey?: string;
  name?: string;
  description?: string;
  url?: string;
  ownerId?: string;
}

const DEFAULT_LIMIT = 10;

export const VideoDAL = {
  createAnonVideo: async (params: CreateVideoAttr) => {
    return VideoModel.create({
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
  createUserVideo: async (params: { id: string; ownerId: string }) => {
    return await sequelize.transaction(async (tx) => {
      const count = await VideoModel.count({
        where: { ownerId: params.ownerId },
        transaction: tx,
      });

      const url = `/${count + 1}`;

      return VideoModel.create(
        {
          id: params.id,
          muxAssetStatus: MuxAssetStatus.PREPARING,
          url: url,
          ownerId: params.ownerId,
        },
        { transaction: tx }
      );
    });
  },
  list: async (limit = DEFAULT_LIMIT) => {
    return VideoModel.findAll({ order: [["createdAt", "DESC"]], limit: limit });
  },

  listPreparingVideo: async (limit = DEFAULT_LIMIT) => {
    return VideoModel.findAll({
      where: { muxAssetStatus: MuxAssetStatus.PREPARING },
      limit: limit,
    });
  },

  get: async (videoId: string) => {
    return VideoModel.findByPk(videoId);
  },

  getByUrl: async (vanityUrl: string) => {
    return VideoModel.findOne({ where: { url: vanityUrl } });
  },

  getBySequenceId: async (sequenceId: string) => {
    return VideoModel.findOne({ where: { sequenceId } });
  },

  getByMuxAssetId: async (muxAssetId: string) => {
    return VideoModel.findOne({ where: { muxAssetId: muxAssetId } });
  },
};
