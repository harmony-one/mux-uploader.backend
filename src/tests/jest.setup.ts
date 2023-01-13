import { AppEnv, config } from "../config/config";

if (config.appEnv !== AppEnv.TEST) {
  throw new Error(`Wrong env for test env: ${config.appEnv}`);
}
