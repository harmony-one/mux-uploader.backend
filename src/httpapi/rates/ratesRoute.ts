import { Router, Request, Response } from "express";
import { ONE_MINUTE } from "../../constants/dates";
import { rateClient } from "./rateClinet";
import { logger } from "../../logger";

export const ratesRouter = Router();

let oneRateCache = 0.020740168501869546;

const updateRate = () => {
  rateClient
    .loadONE()
    .then((rate) => {
      oneRateCache = rate;
    })
    .catch((ex) => {
      logger.error("load rate error", { meta: { exception: ex.message } });
    });
};

const runRateWatcher = async () => {
  updateRate();
  setTimeout(() => {
    runRateWatcher();
  }, ONE_MINUTE * 10);
};

runRateWatcher();

ratesRouter.get("/ONE", async (req: Request, res: Response) => {
  res.set("Cache-control", `public, max-age=60`);
  return res.json({ data: oneRateCache });
});
