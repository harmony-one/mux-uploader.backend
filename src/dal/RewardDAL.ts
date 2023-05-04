import { v4 as uuidv4 } from "uuid";
import { ReferralReward, RewardModel } from "../db/models/RewardModel";
import { loadDomainOwner, loadDomainPrice } from "../httpapi/domain/dcContract";
import { BN } from "ethereumjs-util";
import { sendCoinsBySafe } from "../blockchain/sendCoins";
import { logger } from "../logger";
import { DomainDAL } from "./DomainDAL";

interface CreateRewardReferralRewardAttrs {
  referral: string;
  domainName: string;
}

const log = logger.child({ module: "RewardDal" });

async function calculateRewardAmount(domainName: string): Promise<string> {
  const price = await loadDomainPrice(domainName);
  return new BN(price).divn(100).muln(50).toString();
}

export const RewardDAL = {
  createReferralReward: async (params: CreateRewardReferralRewardAttrs) => {
    const { referral, domainName } = params;
    const id = uuidv4();

    const data: ReferralReward = {
      reason: "referralReward",
      domainName,
      referral,
    };

    const domain = await DomainDAL.get(domainName);

    if (!domain) {
      log.error("error domain doesn't exist", {
        meta: { domainName, referral },
      });
      return;
    }

    const existedReward = await RewardModel.findOne({
      where: { data: { reason: "referralReward", domainName: domainName } },
    });

    if (existedReward) {
      console.log("### existedReward", JSON.stringify(existedReward));
      log.error("error reward already exist", {
        meta: { domainName, referral },
      });
      return;
    }

    const amount = await calculateRewardAmount(domainName);
    const destinationAddress = await loadDomainOwner(referral);

    const reward = await RewardModel.create({
      id,
      status: "init",
      data,
      destinationAddress,
      amount,
    });

    RewardDAL.sendReferralReward(reward.id);
    return;
  },

  sendReferralReward: async (rewardId: string) => {
    const reward = await RewardModel.findByPk(rewardId);

    if (!reward || reward.status === "success") {
      return { result: false, error: "the reward has already been sent" };
    }

    await reward.update({ status: "progress" });

    try {
      const response = await sendCoinsBySafe(
        reward.destinationAddress,
        reward.amount
      );

      if (!response.result) {
        log.error("error send reward", { meta: { error: response.error } });
        await reward.update({ status: "fail" });
        return;
      }

      if (response.result && response.receipt) {
        await reward.update({
          status: "success",
          transactionHash: response.receipt.transactionHash,
        });
      } else {
        await reward.update({ status: "fail" });
      }

      logger.info("reward has been sent", { rewardId });
    } catch (ex) {
      log.error("send reward error", { meta: ex });
      await reward.update({ status: "fail" });
    }
  },

  list: ({
    offset = 0,
    limit = 100,
    filters = {},
  }: {
    offset?: number;
    limit?: number;
    filters?: { status?: "success" | "init" | "fail" };
  }) => {
    return RewardModel.findAndCountAll({
      limit,
      offset,
      where: filters,
      order: [["createdAt", "DESC"]],
    });
  },
};
