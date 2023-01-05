import {
  Table,
  Model,
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
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoCreationAttributes
  extends Optional<
    VideoAttributes,
    "createdAt" | "updatedAt" | "muxPlaybackId"
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

  @Column
  name: string;

  @Column
  description: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
