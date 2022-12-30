import "dotenv/config";

export enum AppEnv {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}

interface AppConfig {
  appEnv: AppEnv;
  aws: {
    s3: {
      region: string;
      bucket: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  mux: {
    tokenId: string;
    tokenSecret: string;
  };
}

function getAppEnv(envStr: string | undefined) {
  const env = envStr;
  if (
    env === AppEnv.TEST ||
    env === AppEnv.DEVELOPMENT ||
    env === AppEnv.PRODUCTION
  ) {
    return env;
  }

  throw new Error("APP_ENV is invalid");
}

export const config: AppConfig = {
  appEnv: getAppEnv(process.env.APP_ENV),
  aws: {
    s3: {
      region: process.env.S3_REGION || "",
      bucket: process.env.S3_BUCKET || "",
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  },
  mux: {
    tokenId: process.env.MUX_TOKEN_ID || "",
    tokenSecret: process.env.MUX_TOKEN_SECRET || "",
  },
};
