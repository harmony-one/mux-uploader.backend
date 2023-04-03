import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { UserDAL } from "../../dal/UserDAL";
import { config } from "../../config/config";
import { jwtAuthRequired } from "../passport";
import { buildMessage, isValidSignature } from "./authUtils";

export const authWeb3Router = Router();
const nonceValidator = [body("address").escape().trim().exists()];
authWeb3Router.post(
  "/nonce",
  nonceValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.body;

    const user = await UserDAL.getByAddress(address);

    if (user) {
      return res.json({
        data: {
          nonce: user.nonce,
          message: buildMessage(user.nonce),
        },
      });
    }

    const newUser = await UserDAL.createNewUser({ address });

    return res.json({
      data: {
        nonce: newUser.nonce,
        message: buildMessage(newUser.nonce),
      },
    });
  }
);

const signatureValidator = [
  body("signature").escape().trim().exists(),
  body("address").escape().trim().exists(),
];

authWeb3Router.post(
  "/signature",
  signatureValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await UserDAL.getByAddress(req.body.address);
      if (!user) {
        return res.sendStatus(404);
      }

      const isSignatureValid = isValidSignature({
        message: buildMessage(user.nonce),
        address: user.address,
        signature: req.body.signature,
      });

      if (!isSignatureValid) {
        return res.sendStatus(403);
      }

      await UserDAL.updateNonce(user);

      const token = jwt.sign(
        {
          _id: user.id,
          address: user.address,
        },
        config.jwtSecret,
        { expiresIn: "30d" }
      );

      return res.json({
        data: {
          token,
        },
      });
    } catch (ex) {
      return next(ex);
    }
  }
);

authWeb3Router.get("/test", jwtAuthRequired, (req: Request, res: Response) => {
  return res.json(req.user);
});
