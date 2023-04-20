import { NextFunction, Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { RewardDAL } from "../../dal/RewardDAL";
import { createInterval } from "../../utils/createInterval";
import { ONE_MINUTE } from "../../constants/dates";

const sendRewardsInterval = createInterval(async () => {
  const rewardList = await RewardDAL.list({
    limit: 10,
    filters: { status: "fail" },
  });

  for (const reward of rewardList) {
    await RewardDAL.sendReferralReward(reward.id);
  }
}, ONE_MINUTE * 10);

sendRewardsInterval();

export const rewardRouter = Router();

const listValidation = checkSchema({
  limit: {
    in: "query",
    optional: true,
    errorMessage: "limit is wrong",
    isInt: true,
    toInt: true,
  },
  status: {
    in: "query",
    optional: true,
    errorMessage: "status is wrong",
    isString: true,
  },
  offset: {
    in: "query",
    optional: true,
    errorMessage: "limit is wrong",
    isInt: true,
    toInt: true,
  },
});

rewardRouter.get(
  "/",
  listValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      offset,
      status,
      limit = 30,
    } = req.query as unknown as {
      offset?: number;
      limit?: number;
      hasReferral?: boolean;
      status: "success" | "fail" | "init";
    };

    let filters = {};

    if (status) {
      filters = {
        ...filters,
        status,
      };
    }

    try {
      const rewardList = await RewardDAL.list({
        filters,
        offset,
        limit,
      });

      return res.json({ data: rewardList });
    } catch (ex) {
      return next(ex);
    }
  }
);
