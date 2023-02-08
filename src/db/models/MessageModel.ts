import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

export interface MessageAttributes {
  id: string;
  domain: string;
  content: string;
}

export interface MessageCreationAttributes extends MessageAttributes {}

@Table({ tableName: "Messages" })
export class MessageModel extends Model<
  MessageAttributes,
  MessageCreationAttributes
> {
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    get() {
      return JSON.parse(this.getDataValue("content"));
    },
    set(value) {
      return this.setDataValue("content", JSON.stringify(value));
    },
  })
  content: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  domain: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
