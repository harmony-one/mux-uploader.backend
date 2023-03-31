import { Router, Request, Response } from "express";
import { ONE_MINUTE } from "../../constants/dates";
import { rateClient } from "./rateClinet";

export const ratesRouter = Router();

let oneRateCache = 0.020740168501869546;

setInterval(() => {
  rateClient.loadONE().then((rate) => {
    oneRateCache = rate;
  });
}, ONE_MINUTE);

const updateRate = () => {
  rateClient.loadONE().then((rate) => {
    oneRateCache = rate;
  });
};

const runRateWatcher = async () => {
  updateRate();
  setTimeout(() => {
    runRateWatcher();
  }, ONE_MINUTE);
};

runRateWatcher();

ratesRouter.get("/ONE", async (req: Request, res: Response) => {
  res.set("Cache-control", `public, max-age=60`);
  return res.json({ data: oneRateCache });
});
