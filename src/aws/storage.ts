import S3 from "aws-sdk/clients/s3";
import * as Buffer from "buffer";
import { config } from "../config";

const DEFAULT_EXPIRES_TIME = 60 * 60 * 24;

const s3 = new S3({
  endpoint: config.storj.endpoint,
  region: config.storj.region,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  httpOptions: {
    timeout: 0,
  },
  accessKeyId: config.storj.accessKeyId,
  secretAccessKey: config.storj.secretAccessKey,
});

export const storage = {
  uploadFile: (data: Buffer, uuid: string) => {
    return s3
      .upload({
        Bucket: config.storj.bucket,
        Key: uuid,
        Body: data,
      })
      .promise();
  },
  getSignedUrl: (key: string, expires = DEFAULT_EXPIRES_TIME) => {
    return s3.getSignedUrlPromise("getObject", {
      Bucket: config.storj.bucket,
      Key: key,
      Expires: expires,
    });
  },
};
