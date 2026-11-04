import test from 'ava';
import { testStrToLines } from '../../utils/test.js';
import { commonIsPassword } from '../../utils/common.js';

const valids = testStrToLines(`
Password1
Qwerty12
Aa123456
HelloWorld1
MyPass99
Abcdefg1
Test1234A
Zxcvbnm1
Q1w2e3r4
A1b2C3d4
`);

const invalids = testStrToLines(`
12345678
abcdefgh
ABCDEFGH
Abcdefgh
1234abcd
1234ABCD
Abc123
Pass1
A1b2C3
password1
`);

test('validPasswords', t => {
  console.log('validPasswords');
  for (const password of valids) {
    t.true(commonIsPassword(password), password);
  }
});

test('invalidPasswords', t => {
  console.log('invalidPasswords');
  for (const password of invalids) {
    t.false(commonIsPassword(password), password);
  }
});