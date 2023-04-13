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
  linkId: {
    in: "body",
    errorMessage: "linkId is wrong",
    isString: true,
    trim: true,
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
      const { domainName, linkId, url } = req.body;
      const domainData = await DomainDAL.get(domainName);

      if (!domainData) {
        throw new Error(`Domain with name "${domainName}" not found`);
      }

      const data = await LinkDAL.create({
        domainId: domainData?.dataValues.id,
        linkId,
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
  id: {
    in: "params",
    errorMessage: "id is wrong",
    exists: true,
    isString: true,
  },
});

linkRouter.delete(
  "/:id",
  createRateLimiter({ windowMs: ONE_MINUTE, max: 60 }),
  deleteValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      await LinkDAL.destroy(id);

      return res.json({
        data: id,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);

const pinValidation = checkSchema({
  id: {
    in: "body",
    errorMessage: "id is wrong",
    isString: true,
    trim: true,
  },
  isPinned: {
    in: "body",
    errorMessage: "isPinned is wrong",
    isBoolean: true,
  },
});

linkRouter.post(
  "/pin",
  createRateLimiter({ windowMs: ONE_MINUTE, max: 10 }),
  pinValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id, isPinned = false } = req.body;
      const link = await LinkDAL.get(id);

      if (!link) {
        throw new Error(`Link with id "${id}" not found`);
      }

      const data = await LinkDAL.pin(id, isPinned);

      return res.json({
        data,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);
