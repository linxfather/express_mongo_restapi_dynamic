import test from 'ava';
import { testStrToLines } from '../../utils/test.js';
import { commonIsEmail } from '../../utils/common.js';

const validEmails = testStrToLines(`
// Simple cases
"test@example.com"
"user@gmail.com"
"info@yandex.ru"

// With dots in local part
"john.doe@company.com"
"first.last@domain.org"
"a.b.c.d@example.net"

// With hyphens
"my-mail@domain.com"
"user-name@mail.ru"
"hello-world@example.org"

// With underscores
"user_name@domain.com"
"_test@example.com"
"hello_world@mail.ru"

// Complex local parts
"a.b-c_d@example.com"
"test123@domain.co.uk"

// Top-level domains
"test@domain.info"
"user@site.biz"
"email@domain.museum"

// Single-character parts
"a@b.c"
"x@y.z"
`);

const invalidEmails = testStrToLines(`
// Missing @
"testexample.com"
"usergmail.com"

// Missing top-level domain
"test@domain"
"user@localhost"
"name@company"

// With spaces
"test @example.com"
"test@ example.com"
"test@example. com"

// Special characters (not allowed by regex)
"test!@example.com"
"test#@domain.com"
"test$@mail.ru"
"test%@gmail.com"

// Empty strings
""
" "
"   "
// Only @
"@"
"@domain.com"
"test@"

// Incorrect TLD
"test@domain.commmmmmmmmmmmmmm"  // too long (>3 chars)

// Double dots
"test..test@domain.com"
"test@domain..com"

// Dots at start/end
".test@domain.com"
"test.@domain.com"
"test@.domain.com"
"test@domain.com."

// Multiple @ symbols
"test@domain@example.com"

// Cyrillic characters
"тест@пример.рф"
"user@домен.рф"
`);

test('validEmails', t => {
  for (const email of validEmails) {
    t.true(commonIsEmail(email), email);
  }
});

test('invalidEmails', t => {
  for (const email of invalidEmails) {
    t.false(commonIsEmail(email), email);
  }
});