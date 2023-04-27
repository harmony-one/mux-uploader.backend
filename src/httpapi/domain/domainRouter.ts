import { Request, Response, Router } from "express";
import { DomainDAL } from "../../dal/DomainDAL";
import { checkSchema, validationResult } from "express-validator";
import { loadDomainOwner } from "./dcContract";
import { logger } from "../../logger";
import { jwtAuthRequired } from "../passport";
import { UserModel } from "../../db/models/UserModel";
import { createRateLimiter } from "../rateLimit";
import { ONE_MINUTE } from "../../constants/dates";
import { DomainModel } from "../../db/models/DomainModel";
import { Op } from "sequelize";
import { RewardDAL } from "../../dal/RewardDAL";

export const domainsRouter = Router();

const domainRegex = /^[a-zA-Z0-9]{1,}((?!-)[a-zA-Z0-9]{0,}|-[a-zA-Z0-9]{1,})+$/;

const getValidation = checkSchema({
  domainName: {
    in: "params",
    matches: {
      options: [domainRegex],
    },
  },
});

domainsRouter.get(
  "/:domainName",
  getValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { domainName } = req.params;

    try {
      const domain = await DomainDAL.get(domainName);

      if (domain) {
        return res.json({ data: domain });
      }

      const ownerAddress = await loadDomainOwner(domainName);

      if (ownerAddress) {
        const domainR = await DomainDAL.create({ domain: domainName });
        return res.json({ data: domainR });
      }
    } catch (ex) {
      logger.error(`error GET domain ${domainName}`, ex);
      return res.status(503).json({ errors: ["interval error"] });
    }

    return res.status(404).json({ errors: ["not found"] });
  }
);

const listValidation = checkSchema({
  offset: {
    in: "query",
    isNumeric: true,
    trim: true,
    escape: true,
    optional: true,
    toInt: true,
  },
  limit: {
    in: "query",
    isNumeric: true,
    trim: true,
    escape: true,
    optional: true,
    toInt: true,
  },
  hasReferral: {
    in: "query",
    isBoolean: true,
    toBoolean: true,
    optional: true,
  },
});

domainsRouter.get("/", listValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    limit = 100,
    offset = 0,
    hasReferral,
  } = req.query as unknown as {
    offset?: number;
    limit?: number;
    hasReferral?: boolean;
  };

  if (hasReferral) {
    const { rows, count } = await DomainModel.findAndCountAll({
      where: { referral: { [Op.ne]: "" } },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ count, data: rows });
  }

  const { rows, count } = await DomainDAL.list({ offset, limit });

  res.json({ meta: { count, limit, offset }, data: rows });
});

const createValidation = checkSchema({
  domain: {
    in: "body",
    errorMessage: "domain is wrong",
    matches: {
      options: [domainRegex],
    },
    isString: true,
    trim: true,
    escape: true,
  },
  referral: {
    optional: true,
    matches: {
      options: [domainRegex],
    },
  },
  txHash: {
    optional: true,
    in: "body",
    errorMessage: "txHash is wrong",
    isString: true,
    trim: true,
    escape: true,
  },
});

domainsRouter.post(
  "/",
  createRateLimiter({ windowMs: ONE_MINUTE, max: 60 }),
  createValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { referral, domain } = req.body;
    const ownerAddress = await loadDomainOwner(domain);

    if (!ownerAddress) {
      logger.error("Error create domain", "domain has no owner");
      return res.status(403).json({ errors: ["domain has no owner"] });
    }

    try {
      const domainExist = await DomainDAL.get(domain);
      if (domainExist) {
        return res.json({ data: domainExist });
      }

      const domainR = await DomainDAL.create({ domain, referral });

      if (referral) {
        RewardDAL.createReferralReward({
          referral,
          domainName: domain,
        });
      }

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
  domainName: {
    in: "params",
    matches: {
      options: [domainRegex],
    },
  },
});

domainsRouter.put(
  "/:domainName",
  createRateLimiter({ windowMs: ONE_MINUTE, max: 60 }),
  jwtAuthRequired,
  updateValidation,
  async (req: Request, res: Response) => {
    const { domainName } = req.params;

    if (!req.user) {
      return res.json(401);
    }

    const currentUser = req.user as UserModel;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let domain = await DomainDAL.get(domainName);
      if (!domain) {
        const ownerAddress = await loadDomainOwner(domainName);

        if (ownerAddress != currentUser.address) {
          return res.status(403).json({ errors: ["permission denied"] });
        }

        domain = await DomainDAL.create({
          domain: domainName,
        });
      }

      const { bgColor } = req.body;

      const domainUpdated = await DomainDAL.update({
        domainId: domain.id,
        data: { bgColor },
      });
      return res.json({ data: domainUpdated });
    } catch (ex) {
      logger.error("error domain update", { error: ex });
      return res.status(500).json({ errors: ["internal error"] });
    }
  }
);
