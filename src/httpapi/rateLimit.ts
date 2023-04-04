import rateLimit from "express-rate-limit";

export const createRateLimiter = (opt: { windowMs: number; max: number }) => {
  const { windowMs, max } = opt;
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
