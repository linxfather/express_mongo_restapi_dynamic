import { apiv1Info } from '../../constants/apiv1.js';
import { env } from '../../config/env.js';
import { mongooseConnectTest } from '../../config/modules/mongoose.js';
import { User } from '../../src/models/schemas/user.schema.js';
import mongoose from 'mongoose';
import test from 'ava';

// TODO: атомарные тесты, сейчас последовательно зависимые
// npx ava tests/restapi/user.test.js

const local = apiv1Info.localhostURL + '/users';

test ('users', async t => {
  // connect and clean
  console.log('connect and clean');
  await mongooseConnectTest();
  await User.deleteMany({});
  //
  try {
    let res = await fetch(`${local}`);
    t.true(res.status === 404, 'status 404');
  } catch (err) {
    t.true(false, err.message);
  }
  // insert (post) - err
  console.log('insert (post) - err');
  try {
    let res = await fetch(`${local}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'name1'
      })
    });
    t.true(res.status === 422, 'status 422');
  } catch (err) {
    t.true(false, err.message);
  }
  // insert (post) - ok
  console.log('insert (post) - ok');
  let json = null;
  try {
    let res = await fetch(`${local}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'name1',
        email: 'name1@mail.ru',
        password: 'passPass1'
      })
    });
    t.true(res.status === 201, 'status 201');
    json = await res.json();
    t.truthy(json.data._id, 'data.data._id exists');
  } catch (err) {
    t.true(false, err.message);
  }
  // update (put) - ok
  console.log('update (put) - ok');
  let id = json.data._id;
  try {
    let res = await fetch(`${local}/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'nameNewValue',
      })
    });
    t.true(res.status === 200, 'status 200');
    json = await res.json();
    t.true(json.data.name === 'nameNewValue', 'name === nameNewValue');
  } catch (err) {
    t.true(false, err.message);
  }
  id = json.data._id;
  // get id
  console.log('get id');
  try {
    let res = await fetch(`${local}/${id}`);
    t.true(res.status === 200, 'status 200');
    json = await res.json();
    t.true(json.data.name === 'nameNewValue', 'name === nameNewValue');
  } catch (err) {
    t.true(false, err.message);
  }
  // pagination
  await User.deleteMany({});
  for (let i = 0; i<20; i++) {
    console.log('pagination insert', i);
    try {
      let res = await fetch(`${local}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: 'pagination ' + i,
          email: 'em@em.com' + i,
          password: 'passPass' + i
        })
      });
      t.true(res.status === 201, 'pagination status 201 ' + i);
    } catch (err) {
      t.true(false, err.message);
      break;
    }
  }
  // pagination page 2
  console.log('pagination page 2');
  try {
    let res = await fetch(`${local}?page=2&limit=5`);
    t.true(res.status === 200, 'pagination status 200');
    json = await res.json();
    t.true(json.data[0].name === 'pagination 5', 'pagination 5 item at page 2');
  } catch (err) {
    t.true(false, err.message);
  }
  //
  await mongoose.connection.close();
});





