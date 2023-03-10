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
  createdTxHash: string;
}

export interface DomainCreationAttributes extends DomainAttributes {}

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
    allowNull: false,
  })
  createdTxHash: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
