import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  PrimaryKey,
  Default,
} from "sequelize-typescript";

export interface ReferralReward {
  reason: "referralReward";
  domainName: string;
  referral: string;
}

export interface RewardAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  data: ReferralReward;
  status: "success" | "fail" | "init" | "progress";
  transactionHash: string;
  destinationAddress: string;
  amount: string;
}

export interface RewardCreationAttributes
  extends Omit<
    RewardAttributes,
    "transactionHash" | "createdAt" | "updatedAt"
  > {}

@Table({ tableName: "Rewards" })
export class RewardModel extends Model<
  RewardAttributes,
  RewardCreationAttributes
> {
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  data: Object;

  @Default("init")
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: "success" | "fail" | "init" | "progress";

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transactionHash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  destinationAddress: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  amount: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
