import "dotenv/config";

export enum AppEnv {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}

interface AppConfig {
  appEnv: AppEnv;
  jwtSecret: string;
  port: number;
  db: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "postgres";
  };
  aws: {
    s3: {
      region: string;
      bucket: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  storj: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  mux: {
    tokenId: string;
    tokenSecret: string;
    webhookSecret: string;
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

  throw new Error(`APP_ENV is invalid: ${env}`);
}

export const config: AppConfig = {
  appEnv: getAppEnv(process.env.APP_ENV),
  jwtSecret: process.env.JWT_SECRET || "",
  port: parseInt(process.env.PORT || "3001", 10),
  db: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: "postgres",
  },
  aws: {
    s3: {
      region: process.env.S3_REGION || "",
      bucket: process.env.S3_BUCKET || "",
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  },
  storj: {
    endpoint: process.env.STORJ_ENTRYPOINT || "",
    region: process.env.STORJ_REGION || "",
    bucket: process.env.STORJ_BUCKET || "",
    accessKeyId: process.env.STORJ_ACCESS_KEY || "",
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY || "",
  },
  mux: {
    tokenId: process.env.MUX_TOKEN_ID || "",
    tokenSecret: process.env.MUX_TOKEN_SECRET || "",
    webhookSecret: process.env.MUX_WEBHOOK_SECRET || "",
  },
};
