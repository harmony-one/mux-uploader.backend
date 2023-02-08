import { NextFunction, Request, Response, Router } from "express";
import { MessageDAL } from "../../dal/MessagesDAL";
import { checkSchema, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

const reteLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 5 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const messagesRouter = Router();
// const createValidation = [check('domain').exists().isString().trim().escape(), check('content').exists().]
const createValidation = checkSchema({
  domain: {
    in: "body",
    errorMessage: "domain is wrong",
    isString: true,
    trim: true,
    escape: true,
  },
  content: {
    in: "body",
    errorMessage: "content is wrong",
    isObject: true,
  },
});

messagesRouter.post(
  "/",
  reteLimiter,
  createValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { content, domain } = req.body;

      const message = await MessageDAL.create({
        domain,
        content,
      });

      return res.json({
        data: message,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);

const listValidation = checkSchema({
  domain: {
    in: "query",
    errorMessage: "domain is wrong",
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

messagesRouter.get(
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
        filters = {
          domain,
          ...filters,
        };
      }

      const messages = await MessageDAL.getList(filters, limit as number);

      return res.json({
        data: messages,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);

const deleteValidation = checkSchema({
  messageId: {
    in: "params",
    errorMessage: "domain is wrong",
    exists: true,
    isString: true,
  },
});

messagesRouter.delete(
  "/:messageId",
  reteLimiter,
  deleteValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { messageId } = req.params;

    try {
      const message = await MessageDAL.get(messageId);

      await MessageDAL.destroy(messageId);

      return res.json({
        data: message,
      });
    } catch (ex) {
      return next(ex);
    }
  }
);
