import { env } from "../config/env.js";

export const apiv1Info = {
  localhostURL: `http://127.0.0.1:${env.port}/api/v1`,
  prefixURL: '/api/v1'
};