import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

export interface DomainAttributes {
  id: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
  bgColor?: string;
  owner?: string;
  referral?: string;
}

export interface DomainCreationAttributes
  extends Omit<DomainAttributes, "createdAt" | "updatedAt"> {}

@Table({ tableName: "Domains" })
export class DomainModel extends Model<
  DomainAttributes,
  DomainCreationAttributes
> {
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  domain: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bgColor: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  owner: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  referral: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
