import { env as config_env } from "../config/env.js";
import { createLogger } from "../config/modules/winston.js";
import { apiModelsClass } from "../src/models/apiModels.js";

export const env = config_env;
export const logger = createLogger('app', env.debug_mode, true);
export const loggerApi = createLogger('api', false, false);
export const apiModels = new apiModelsClass();
