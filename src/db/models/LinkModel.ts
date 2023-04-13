import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

export interface LinkAttributes {
  id: string;
  domainId: string;
  linkId: string;
  isPinned: boolean;
  url: string;
  rank?: string;
}

export interface LinkCreationAttributes extends LinkAttributes {}

@Table({ tableName: "Links" })
export class LinkModel extends Model<LinkAttributes, LinkCreationAttributes> {
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  domainId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  linkId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPinned: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  rank: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
