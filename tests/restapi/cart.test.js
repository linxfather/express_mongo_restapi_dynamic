import { mongooseConnectTest } from '../../config/modules/mongoose.js';
import { User } from '../../src/models/schemas/user.schema.js';
import { Product } from '../../src/models/schemas/product.schema.js';
import { Cart } from '../../src/models/schemas/cart.schema.js';
import { testFetchv1 } from '../../utils/test.js';
import mongoose from 'mongoose';
import test from 'ava';

// TODO: атомарные тесты, сейчас последовательно зависимые
// npx ava tests/restapi/cart.test.js

test ('cart_example', async t => {
  console.log('connect and clean');
  await mongooseConnectTest();
  await User.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  console.log('insert user 1');
  const OUT = {
    err: null,
    res: null,
    status: null,
    body: null
  };
  await testFetchv1('POST', '/users', {
    name: 'user1',
    email: 'user1@mail.ru',
    password: 'Password1'
  }, OUT);
  t.true(OUT.status === 201, 'user status === 201');
  t.truthy(OUT.body?.data._id, 'user data._id');
  let userId = OUT.body.data._id;
  console.log(userId);
  //
  console.log('insert product 2');
  for (let i = 0; i<2; i++) {
    await testFetchv1('POST', '/products', {
      title: 'product ' + i,
      price: i*100
    }, OUT);
    t.true(OUT.status === 201, 'product status === 201');
  }
  //
  console.log('get products');
  await testFetchv1(null, '/products', null, OUT);
  t.true(OUT.status === 200, 'products status === 200');
  let products = OUT.body.data;
  //
  console.log('write cart');
  products[0].cartCount = 10;
  await testFetchv1('POST', '/carts', {
    userId,
    product: products[0],
  }, OUT);
  t.true(OUT.status === 201, 'cart status === 201');
  //
  await mongoose.connection.close();
});