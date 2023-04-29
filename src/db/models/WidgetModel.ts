import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

export interface WidgetAttributes {
  id: string;
  html: string;
  title: string;
  owner: string;
}

export interface WidgetCreationAttributes extends WidgetAttributes {}

@Table({ tableName: "Widgets" })
export class WidgetModel extends Model<
  WidgetAttributes,
  WidgetCreationAttributes
> {
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  html: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
