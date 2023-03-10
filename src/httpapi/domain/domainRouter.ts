import { NextFunction, Request, Response, Router } from "express";
import { DomainDAL } from "../../dal/DomainDAL";
import { checkSchema, validationResult } from "express-validator";
import { checkDomainTx } from "./dcContract";

export const domainsRouter = Router();

domainsRouter.get(
  "/:domainName",
  async (req: Request, res: Response, next: NextFunction) => {
    const { domainName } = req.params;

    const domain = await DomainDAL.get(domainName);

    if (domain) {
      return res.json({ data: domain });
    }

    return res.status(404).json({ errors: ["not found"] });
  }
);

const createValidation = checkSchema({
  domain: {
    in: "body",
    errorMessage: "domain is wrong",
    isString: true,
    trim: true,
    escape: true,
  },
  txHash: {
    in: "body",
    errorMessage: "txHash is wrong",
    isString: true,
    trim: true,
    escape: true,
  },
});

domainsRouter.post(
  "/",
  createValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { txHash, domain } = req.body;

      const domainExist = await DomainDAL.get(domain);
      if (domainExist) {
        return res.json({ data: domainExist });
      }

      const isValid = await checkDomainTx(domain, txHash);

      if (!isValid) {
        return res.status(400).json({ errors: ["invalid tx or domain"] });
      }

      const domainR = await DomainDAL.create({ domain, createdTxHash: txHash });

      return res.json({ data: domainR });
    } catch (ex) {
      return res.status(400).json({ errors: ["unexpected error"] });
    }
  }
);
