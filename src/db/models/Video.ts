import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

import { Optional } from "sequelize";

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
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
}

interface VideoCreationAttributes
  extends Optional<
    VideoAttributes,
    "createdAt" | "updatedAt" | "muxPlaybackId" | "thumbnail"
  > {}

@Table
export class Video extends Model<VideoAttributes, VideoCreationAttributes> {
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
