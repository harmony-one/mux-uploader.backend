import { NextFunction, Request, Response, Router } from "express";
import { DomainDAL } from "../../dal/DomainDAL";
import { checkSchema, validationResult } from "express-validator";
import { jwtAuthRequired } from "../passport";
import { loadDomainOwner } from "./dcContract";
import { logger } from "../../logger";

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

    const { referral, domain } = req.body;
    const ownerAddress = await loadDomainOwner(domain);

    if (!ownerAddress) {
      return res.status(403).json({ errors: ["domain has no owner"] });
    }

    try {
      const domainExist = await DomainDAL.get(domain);
      if (domainExist) {
        return res.json({ data: domainExist });
      }

      const domainR = await DomainDAL.create({ domain, referral });

      return res.json({ data: domainR });
    } catch (ex) {
      logger.error("domain create error", { error: ex });
      return res.status(400).json({ errors: ["unexpected error"] });
    }
  }
);

const updateValidation = checkSchema({
  bgColor: {
    in: "body",
    errorMessage: "bgColor is wrong",
    isString: true,
    trim: true,
    escape: true,
  },
});

domainsRouter.put(
  "/:domainName",
  updateValidation,
  async (req: Request, res: Response) => {
    const { domainName } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let domain = await DomainDAL.get(domainName);
      if (!domain) {
        const ownerAddress = await loadDomainOwner(domainName);

        if (!ownerAddress) {
          return res.status(403);
        }

        domain = await DomainDAL.create({
          domain: domainName,
          createdTxHash: "",
        });
      }

      const { bgColor } = req.body;

      const domainUpdated = await DomainDAL.update({
        domainId: domain.id,
        data: { bgColor },
      });
      return res.json({ data: domainUpdated });
    } catch (ex) {
      return res.status(403).json({ errors: ["internal error"] });
    }
  }
);
