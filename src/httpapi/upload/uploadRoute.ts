import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { body } from "express-validator";
import { storage } from "../../aws/storage";
import { mux } from "../../mux";
import { VideoDAL } from "../../dal/video";

export const uploadRouteValidators = [
  body("name").isLength({ min: 244 }).trim().escape(),
  body("description").trim().escape(),
  body("url").trim().escape(),
];

export const uploadRoute = async (req: Request, res: Response) => {
  if (!req.files || !req.files.video) {
    return res.json({ files: Object.keys(req.files || {}) });
  }

  const { name = "", description = "", url = "" } = req.body;

  const file = req.files.video as UploadedFile;

  const id = uuidv4();
  const ext = file.name.split(".").pop();
  const objectKey = id + "." + ext;

  res.json({
    data: {
      id,
      url,
    },
  });

  const sendData = await storage.uploadFile(file.data, objectKey);

  const signedUrl = await storage.getSignedUrl(objectKey);
  const asset = await mux.createAsset(id, signedUrl);

  await VideoDAL.createVideo({
    id,
    muxAssetId: asset.id,
    awsKey: objectKey,
    awsURL: sendData.Location,
    name: name,
    url: url,
    description: description,
  });
};
