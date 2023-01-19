import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { body } from "express-validator";
import { storage } from "../../aws/storage";
import { mux } from "../../mux";
import { VideoDAL } from "../../dal/VideoDAL";
import { jwtAuthRequired } from "../passport";
import { UserModel } from "../../db/models/UserModel";

export const uploadRouteValidators = [
  body("name").isLength({ min: 244 }).trim().escape(),
  body("description").trim().escape(),
  body("url").trim().escape(),
];

export const uploadRouter = Router();

uploadRouter.post(
  "/upload",
  uploadRouteValidators,
  async (req: Request, res: Response) => {
    if (!req.files || !req.files.video) {
      return res.json({ files: Object.keys(req.files || {}) });
    }

    const { name = "", description = "", url = "" } = req.body;

    const file = req.files.video as UploadedFile;

    const id = uuidv4();
    const ext = file.name.split(".").pop();
    const objectKey = id + "." + ext;

    const video = await VideoDAL.createAnonVideo({
      id,
      name: name,
      url: url,
      description: description,
    });

    res.json({
      data: video,
    });

    const sendData = await storage.uploadFile(file.data, objectKey);
    const signedUrl = await storage.getSignedUrl(objectKey);
    const asset = await mux.createAsset(id, signedUrl);

    video.update({
      muxAssetId: asset.id,
      awsKey: objectKey,
      awsURL: sendData.Location,
      name: name,
      url: url,
      description: description,
    });
  }
);

uploadRouter.post(
  "/create",
  jwtAuthRequired,
  uploadRouteValidators,
  async (req: Request, res: Response) => {
    try {
      if (!req.files || !req.files.video) {
        return res.json({ files: Object.keys(req.files || {}) });
      }

      if (!req.user) {
        return res.sendStatus(403);
      }

      const file = req.files.video as UploadedFile;

      const id = uuidv4();
      const ext = file.name.split(".").pop();
      const objectKey = id + "." + ext;

      const user = req.user as UserModel;

      const video = await VideoDAL.createUserVideo({
        id,
        ownerId: user.id,
      });

      res.json({
        data: video,
      });

      const sendData = await storage.uploadFile(file.data, objectKey);
      const signedUrl = await storage.getSignedUrl(objectKey);
      const asset = await mux.createAsset(id, signedUrl);

      video.update({
        muxAssetId: asset.id,
        awsKey: objectKey,
        awsURL: sendData.Location,
      });
    } catch (ex) {
      return res.status(503).json({ error: "some exception" });
    }
  }
);
