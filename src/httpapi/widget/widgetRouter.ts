import { NextFunction, Request, Response, Router } from "express";
import { WidgetDAL } from "../../dal/WidgetDAL";
import { checkSchema, validationResult } from "express-validator";
import { createRateLimiter } from "../rateLimit";
import { ONE_MINUTE } from "../../constants/dates";

export const widgetRouter = Router();
const createValidation = checkSchema({
  html: {
    in: "body",
    errorMessage: "html is wrong",
    isString: true,
    trim: true,
    escape: true,
  },
  title: {
    in: "body",
    errorMessage: "title is wrong",
    isString: true,
    trim: true,
  },
  owner: {
    in: "body",
    errorMessage: "owner is wrong",
    isString: true,
    trim: true,
  },
});

widgetRouter.post(
  "/",
  createRateLimiter({ windowMs: ONE_MINUTE, max: 10 }),
  createValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, owner, html } = req.body;
      // const domain = await WidgetDAL.get(domainName);

      const data = await WidgetDAL.create({
        html,
        owner,
        title,
      });

      return res.json(data.dataValues);
    } catch (ex) {
      return next(ex);
    }
  }
);

const listValidation = checkSchema({
  limit: {
    in: "query",
    optional: true,
    errorMessage: "limit is wrong",
    isInt: true,
    toInt: true,
  },
});

widgetRouter.get(
  "/",
  listValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit = 30 } = req.query;

    let filters = {};
    try {
      const data = await WidgetDAL.getList(filters, limit as number);
      return res.json({
        data,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);

const getSingleValidation = checkSchema({
  id: {
    in: "params",
    errorMessage: "id is wrong",
    exists: true,
    isString: true,
  },
});

widgetRouter.get(
  "/:id",
  // createRateLimiter({ windowMs: ONE_MINUTE, max: 60 }),
  getSingleValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const data = await WidgetDAL.get(id);

      if (!data) {
        return res.status(404).json({ errors: "Widget not found" });
      }

      return res.json(data);
    } catch (ex) {
      return next(ex);
    }
  }
);
