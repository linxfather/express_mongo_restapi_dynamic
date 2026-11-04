import { apiv1Info } from '../constants/apiv1.js';
import { checkParams, loggerApiReq, router as restApiRouter } from './routers/restapi.router.js';
import { logger, loggerApi, env } from '../constants/app.js';
import { mongooseConnect, mongooseConnectTest } from '../config/modules/mongoose.js';
import express from 'express';

const p1 = process.argv[2] || '';

const app = express();
const apiPrefix = apiv1Info.prefixURL;

app.set('json spaces', 2); // prettyprint
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiPrefix, loggerApiReq);
app.use(apiPrefix, checkParams);
app.use(apiPrefix, restApiRouter);

app.get('/', (req, res) => {
  res.send(`REST API working! ${apiPrefix}{modelName}`);
});

app.use((err, req, res, next) => {
  logger.error(`url: ${req.url} error: ${err.message}`);
  res.status(500).json({ 
    message: 'app error',
    error: env.debug_mode ? err : {}
  });
});

(async () => {
  if (p1 === 'test_db') {
    await mongooseConnectTest();
  } else {
    await mongooseConnect();
  }
  app.listen(env.port, env.host, () => {
    logger.info(`Server running http://${env.host}:${env.port}`);
  });
})();
