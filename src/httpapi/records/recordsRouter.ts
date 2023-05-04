import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";

export const recordsRouter = Router();

const validation = checkSchema({
  domains: {
    in: "query",
    isString: true,
    trim: true,
    escape: true,
    optional: true,
  },
});

recordsRouter.get("/", validation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { domains: domainsString } = req.query as unknown as {
    domains: string;
  };

  const domainList = domainsString.split(",").slice(0, 50);

  const results = [];
  for (let domain of domainList) {
    results.push({
      domain,
      records: {},
    });
  }

  try {
    res.json({ data: results });
    return;
  } catch (ex: any) {
    res.status(500).json({ error: ex.message });
  }
});
