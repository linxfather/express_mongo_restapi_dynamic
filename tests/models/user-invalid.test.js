import test from 'ava';
import { 
  testModelSchemaValidate,
  testModelSchemaInvalidMessage
} from '../../utils/test.js';
import { User } from '../../src/models/schemas/user.schema.js';

/*
npx ava tests/models/user-invalid.test.js
  npx ava tests/models/user-invalid.test.js --match="invalid"
*/

test('valid', async t => {
  let row = new User({
    name: 'Any name',
    email: 'valid@valid.ru',
    password: 'ValidPassword1'
  });
  await testModelSchemaValidate(t, row, 'User');
});

test('invalid', async t => {
  let row = new User({
    name: '',
    email: 'valid@valid.ru',
    password: 'ValidPassword1'
  });
  let message = await testModelSchemaInvalidMessage(t, row);
  t.true(message.includes('validation failed: name'));
  row = new User({
    name: 'Any name',
    email: 'validvalid.ru',
    password: 'ValidPassword1'
  });
  message = await testModelSchemaInvalidMessage(t, row);
  t.true(message.includes('validation failed: email'));
  row = new User({
    name: 'Any name',
    email: 'valid@valid.ru',
    password: 'ValidPassword'
  });
  message = await testModelSchemaInvalidMessage(t, row);
  t.true(message.includes('validation failed: password'));
});