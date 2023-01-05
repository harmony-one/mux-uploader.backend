import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { body } from "express-validator";
import { s3Api } from "../../aws";
import { mux } from "../../mux";
import { VideoDAL } from "../../dal/video";

export const uploadRouteValidators = [
  body("name").isLength({ min: 244 }).trim().escape(),
  body("description").trim().escape(),
];

export const uploadRoute = async (req: Request, res: Response) => {
  if (!req.files || !req.files.video) {
    return res.json({ files: Object.keys(req.files || {}) });
  }

  const { name = "", description = "" } = req.body;

  const file = req.files.video as UploadedFile;

  const id = uuidv4();
  const ext = file.name.split(".").pop();
  const awsKey = id + "." + ext;

  res.json({
    data: {
      id,
    },
  });

  const sendData = await s3Api.uploadFile(file.data, id + "." + ext);

  const asset = await mux.createAsset(id, sendData.Location);

  await VideoDAL.createVideo({
    id,
    muxAssetId: asset.id,
    awsKey,
    awsURL: sendData.Location,
    name: name,
    description: description,
  });
};
