import { Router, Request, Response } from "express";
import { DomainDAL } from "../../dal/DomainDAL";
import { config } from "../../config/config";
import { loadResolver } from "../domain/dcContract";

export const reverseRouter = Router();

let resolverAddress = "";

loadResolver().then((addr: string) => {
  resolverAddress = addr;
});

reverseRouter.get("/:address", async (req: Request, res: Response) => {
  const { address } = req.params;

  try {
    const domain = await DomainDAL.getByAddress(address);

    if (!domain) {
      return res.status(404).json({ data: [] });
    }

    const data = {
      networkId: 1666600000,
      blockchain: "harmony",
      resolver: resolverAddress,
      registry: config.harmony.dcContract,
      reverse: true,
      domain: domain.domain + ".country",
      owner: domain.owner,
      createdAt: domain.createdAt,
    };

    res.json({ data });
  } catch (ex) {
    res.sendStatus(500);
  }
});
