import { NextFunction, Request, Response, Router } from "express";
import { LinkDAL } from "../../dal/LinkDAL";
import { checkSchema, validationResult } from "express-validator";
import { createRateLimiter } from "../rateLimit";
import { ONE_MINUTE } from "../../constants/dates";
import { DomainDAL } from "../../dal/DomainDAL";

export const linkRouter = Router();
const createValidation = checkSchema({
  domainName: {
    in: "body",
    errorMessage: "domain is wrong",
    isString: true,
    trim: true,
    escape: true,
  },
  url: {
    in: "body",
    errorMessage: "url is wrong",
    isString: true,
    trim: true,
  },
});

linkRouter.post(
  "/",
  createRateLimiter({ windowMs: ONE_MINUTE, max: 10 }),
  createValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { domainName, url } = req.body;
      const domainData = await DomainDAL.get(domainName);

      if (!domainData) {
        throw new Error(`Domain with name "${domainName}" not found`);
      }

      const data = await LinkDAL.create({
        domainId: domainData?.dataValues.id,
        url,
      });

      return res.json({
        data,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);

const listValidation = checkSchema({
  domain: {
    in: "query",
    errorMessage: "domain name is wrong",
    exists: true,
    isString: true,
    trim: true,
    escape: true,
  },
  limit: {
    in: "query",
    optional: true,
    errorMessage: "limit is wrong",
    isInt: true,
    toInt: true,
  },
});

linkRouter.get(
  "/",
  listValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { domain, limit = 30 } = req.query;

    let filters = {};
    try {
      if (domain && typeof domain === "string") {
        // Filter by joined table column
        // https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#complex-where-clauses-at-the-top-level
        filters = {
          "$DomainModel.domain$": domain,
          ...filters,
        };
      }

      const data = await LinkDAL.getList(filters, limit as number);
      return res.json({
        data,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);

const deleteValidation = checkSchema({
  linkId: {
    in: "params",
    errorMessage: "linkId is wrong",
    exists: true,
    isString: true,
  },
});

linkRouter.delete(
  "/:linkId",
  createRateLimiter({ windowMs: ONE_MINUTE, max: 60 }),
  deleteValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { linkId } = req.params;

    try {
      await LinkDAL.destroy(linkId);

      return res.json({
        data: linkId,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);
