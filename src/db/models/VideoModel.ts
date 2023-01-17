import {
  Table,
  Model,
  Default,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

import { Optional, Sequelize } from "sequelize";

export enum MuxAssetStatus {
  PREPARING = "preparing",
  ERROR = "error",
  READY = "ready",
}

interface VideoAttributes {
  id: string;
  muxAssetId: string;
  muxPlaybackId: string;
  muxAssetStatus: MuxAssetStatus;
  awsURL: string;
  awsKey: string;
  name: string;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  sequenceId: string;
}

interface VideoCreationAttributes
  extends Optional<
    Omit<VideoAttributes, "createdAt" | "updatedAt" | "sequenceId">,
    "muxPlaybackId" | "thumbnail"
  > {}

@Table({ tableName: "Videos" })
export class VideoModel extends Model<
  VideoAttributes,
  VideoCreationAttributes
> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  muxAssetId: string;

  @Column
  muxPlaybackId: string;

  @Column
  muxAssetStatus: MuxAssetStatus;

  @Column
  awsURL: string;

  @Column
  awsKey: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  url: string;

  @Default(Sequelize.literal("nextval('video_sequence')"))
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  sequenceId: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;

  @Column({
    type: DataType.VIRTUAL,
    get: function () {
      return {
        // @ts-ignore
        regular: `https://image.mux.com/${this.muxPlaybackId}/thumbnail.jpg`,
      };
    },
  })
  thumbnails: string;
}
