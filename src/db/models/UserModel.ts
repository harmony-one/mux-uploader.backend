import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

interface UserAttributes {
  id: string;
  address: string;
  nonce: number;
}

interface UserCreationAttributes extends UserAttributes {}

@Table({ tableName: "Users" })
export class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  address: string;

  @Column({
    type: DataType.INTEGER,
  })
  nonce: number;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
