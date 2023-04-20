import { sequelize } from "../src/db/models";
import { RewardModel } from "../src/db/models/RewardModel";

const main = async () => {
  await sequelize.authenticate();

  const rewardList = await RewardModel.findAll();

  for (const rewardItem of rewardList) {
    if (typeof rewardItem.data === "string") {
      await rewardItem.setDataValue("data", JSON.parse(rewardItem.data));
      await rewardItem.save();
    }
  }

  console.log("### done");
};

main();
