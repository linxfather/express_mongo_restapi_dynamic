import dotenv from 'dotenv';
import Joi from 'joi';

class configEnv {
  mongo_uri = '';
  mongo_testdb = false; // optional
  port = 3000;
  host = '127.0.0.1';
  debug_mode = false;
  debug_logger_api = false;

  constructor() {
    // see bug: https://github.com/motdotla/dotenv/issues/904
    process.env.DOTENV_CONFIG_QUIET = true;
    const data = dotenv.config().parsed;
    //
    const schema = Joi.object({
      mongo_uri: Joi.string().pattern(/^mongodb/).required(),
      mongo_testdb: Joi.boolean().default(false),
      port: Joi.number().min(80).required(),
      host: Joi.string().required(),
      debug_mode: Joi.boolean().required(),
      debug_logger_api: Joi.boolean().required(),
    });
    const { error, value } = schema.validate(data);
    if (error) {
      console.log('ERR: configEnv', error);
      process.exit(1);
    }
    Object.assign(this, value);
  }
}

export const env = new configEnv();

