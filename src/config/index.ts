import "dotenv/config";

export enum AppEnv {
  PRODUCTION = "production",
  TEST = "test",
  DEVELOPMENT = "development",
}

interface AppConfig {
  appEnv: AppEnv;
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
};
