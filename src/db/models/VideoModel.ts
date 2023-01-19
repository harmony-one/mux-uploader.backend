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
  ownerId: string;
}

export interface VideoCreationAttributes
  extends Optional<
    Omit<VideoAttributes, "createdAt" | "updatedAt" | "sequenceId">,
    | "muxAssetId"
    | "muxPlaybackId"
    | "awsURL"
    | "awsKey"
    | "name"
    | "url"
    | "description"
    | "thumbnail"
    | "ownerId"
  > {}

@Table({ tableName: "Videos" })
export class VideoModel extends Model<
  VideoAttributes,
  VideoCreationAttributes
> {
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ownerId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  muxAssetId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  muxPlaybackId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  muxAssetStatus: MuxAssetStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  awsURL: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  awsKey: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
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
