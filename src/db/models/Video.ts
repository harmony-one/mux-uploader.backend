import {
  Table,
  Model,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

import { Optional } from "sequelize";

interface VideoAttributes {
  id: string;
  assetId: string;
  awsURL: string;
  awsKey: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoCreationAttributes
  extends Optional<VideoAttributes, "createdAt" | "updatedAt"> {}

@Table
export class Video extends Model<VideoAttributes, VideoCreationAttributes> {
  @PrimaryKey
  @Column
  id: string;
  @Column
  assetId: string;

  @Column
  awsURL: string;

  @Column
  awsKey: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
