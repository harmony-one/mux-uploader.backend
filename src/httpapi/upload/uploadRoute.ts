import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { s3Api } from "../../aws";
import { mux } from "../../mux";
import { VideoDAL } from "../../dal/video";

export const uploadRoute = async (req: Request, res: Response) => {
  if (!req.files || !req.files.video) {
    return res.json({ files: Object.keys(req.files || {}) });
  }

  const file = req.files.video as UploadedFile;

  const id = uuidv4();
  const ext = file.name.split(".").pop();
  const awsKey = id + "." + ext;

  const sendData = await s3Api.uploadFile(file.data, id + "." + ext);

  const asset = await mux.createAsset(id, sendData.Location);

  const video = await VideoDAL.createVideo({
    id,
    assetId: asset.id,
    awsKey,
    awsURL: sendData.Location,
  });

  return res.json({
    data: video.toJSON(),
  });
};
