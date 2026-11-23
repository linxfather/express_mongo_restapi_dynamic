import express from 'express';
import { logger, loggerApi, env, apiModels } from '../../constants/app.js';
import { mongooseConnect } from '../../config/modules/mongoose.js';
import { commonObjectIsValid } from '../../utils/common.js';
import Joi from 'joi';

export const router = express.Router();

function routerSendJson(res, status, json) {
  if (env.debug_logger_api) {
    loggerApi.info(`RES: ${status} ${json ? JSON.stringify(json, null, 2) : ''}`);
  }
  if (json) {
    res.status(status).json(json);
  } else {
    res.status(status).end();
  }
}

export function loggerApiReq(req, res, next) {
  if (env.debug_logger_api) {
    loggerApi.info(`REQ: ${JSON.stringify({
      url: `${req.method} ${req.url}`,
      ...(req.body ? req.body : {}),
      // TODO: headers
    }, null, 2)}`);
  }
  next();
}

router.get('/:name/:id', async (req, res) => {
  const { name, id } = req.params;
  const mClass = apiModels.getClass(name);
  if (mClass) {
    const row = await mClass.findById(id);
    if (row) {
      routerSendJson(res, 200, {data: row});
    } else {
      routerSendJson(res, 404, {error: "not found item"});
    }
  } else {
    routerSendJson(res, 404, {error: "not found collection"});
  }
});

router.delete('/:name/:id', async (req, res) => {
  const { name, id } = req.params;
  const mClass = apiModels.getClass(name);
  if (mClass) {
    const result = await mClass.deleteOne({_id: id});
    // { acknowledged: true, deletedCount: 1 }
    if (result?.acknowledged && result?.deletedCount > 0) {
      routerSendJson(res, 204);
    } else {
      routerSendJson(res, 404, {error: "not found item"});
    }    
  } else {
    routerSendJson(res, 404, {error: "not found collection"});
  }
});

const routerPaginationSchema = Joi.object({
  limit: Joi.number().min(1).max(200).default(10),
  page: Joi.number().min(1).default(1),
  sort: Joi.string()
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const mClass = apiModels.getClass(name);
  if (mClass) {
    const { error, value: query } = routerPaginationSchema.validate(req.query);
    if (error) {
      routerSendJson(res, 404, {error: error.message});
    } else {
      let sort = {_id: 1 };
      if (query.sort) {
        if (!apiModels.hasPath(mClass, query.sort)) {
          routerSendJson(res, 404, {error: 'invalid sort field'});
          return;
        }
        sort = { [query.sort] : 1 };
      }
      const rows = await mClass.find()
        .sort(sort)
        .skip((query.page-1) * query.limit)
        .limit(query.limit);
      if (rows.length) {
        routerSendJson(res, 200, {data: rows});
      } else {
        routerSendJson(res, 404, {error: 'not found items'});
      }
    }
  } else {
    routerSendJson(res, 404, {error: "not found collection"});
  }
});

async function routerUpdateOrInsert(updateMode, req, res) {
  const { name, id } = req.params;
  if (!commonObjectIsValid(req.body)) {
    routerSendJson(res, 422, {error: "Invalid fields request"});
    return;
  }
  const mClass = apiModels.getClass(name);
  if (mClass) {
    let row;
    if (updateMode) {
      row = await mClass.findById(id);
    } else {
      row = new mClass();
    }
    if (row) {
      // TODO: security issues
      const validPaths = apiModels.getValidPathsForUpdate(mClass, Object.keys(req.body));
      if (validPaths.length === 0) {
        routerSendJson(res, 422, {error: "Invalid fields request"});
        return;
      }
      for (const key of validPaths) {
        row[key] = req.body[key];
      }
      try {
        await row.validate();
        await row.save();
        routerSendJson(res, updateMode ? 200 : 201, {data: row});
      } catch (err) {
        routerSendJson(res, 422, {error: err.message});
      }
    } else {
      routerSendJson(res, 404);
    }
  } else {
    routerSendJson(res, 404, {error: "not found collection"});
  }
}

router.put('/:name/:id', routerUpdateOrInsert.bind(null, true));

router.post('/:name', routerUpdateOrInsert.bind(null, false));
