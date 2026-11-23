import mongoose from 'mongoose';
import { env } from '../env.js';
import { netCheckPort } from '../../utils/net.js';

// TODO: default db, test db

export async function mongooseConnect() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const state = mongoose.connection.readyState;
  if (state === 1) return;
  if (state === 2) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    });
    return;
  }
  const mongoURL = new URL(env.mongo_uri);
  console.log(env.mongo_uri, mongoURL.hostname);

  if (await netCheckPort(mongoURL.hostname, mongoURL.port) !== 'open') {
    console.log('ERR: mongoose_connect', `netCheckPort = ${mongoURL.host}`);
    process.exit(1);
    return;
  }
  try {
    let uri = env.mongo_uri;
    if (env.mongo_testdb) {
      uri += '_test';
    }
    await mongoose.connect(uri, {
      // TODO: prod mode configuration
      minPoolSize: 2,
      maxPoolSize: 10
    });
    console.log('OK: mongoose_connect');
  } catch (err) {
    console.log('ERR: mongoose_connect', err.message);
    process.exit(1);
  }
}

export async function mongooseConnectTest() {
  env.mongo_testdb = true;
  console.log('OK: Test DB');
  await mongooseConnect();
}