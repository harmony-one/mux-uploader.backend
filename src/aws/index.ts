import AWS from "aws-sdk";
import { config } from "../config";
import * as Buffer from "buffer";

const s3 = new AWS.S3({
  region: config.aws.s3.region,
  credentials: {
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey,
  },
});

export const s3Api = {
  uploadFile: (data: Buffer, uuid: string) => {
    return s3
      .upload({
        ACL: "public-read",
        Bucket: config.aws.s3.bucket,
        Key: uuid,
        Body: data,
      })
      .promise();
  },
};
