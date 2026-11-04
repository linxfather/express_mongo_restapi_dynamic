#!/usr/bin/env node
import cac from 'cac';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { mongooseConnect } from '../config/modules/mongoose.js';
import { User } from '../src/models/schemas/user.schema.js';

const cli = cac();

//#region test_mongo
cli
  .command('test_mongo_connection')
  .action(async () => {
    console.log('wait 30 sec');
    let time = 0;
    setInterval(() => {
      time += 5;
      console.log('time', time);
    }, 5000);
    await mongooseConnect();
    try {
      await mongoose.connection.db.command({ ping: 1 });
      console.log('OK: db.command({ ping: 1 })');
    } catch (err) {
      console.log(err.message);
    }
    process.exit();
  });

cli
  .command('test_mongo_add_users', '--count <number> max 100')
  .option('--count <number>', 'max 100', { default: 10 })
  .action(async options => {
    const count = parseInt(options.count);
    if (isNaN(count) || count < 1 || count > 100) {
      console.error('invalid count');
      process.exit(1);
    }
    await mongooseConnect();
    //
    for (let i = 0; i < count; i++) {
      const row = new User();
      row.name = faker.person.fullName();
      row.email = faker.internet.email();
      row.password = 'HelloWorld1'; // TODO: valid password
      try {
        await row.validate();
        await row.save();
        console.log(row.toString())
      } catch (err) {
        console.log(err.message);
      }
    }
    process.exit();
  });

cli
  .command('test_mongo_delete_all_users')
  .action(async () => {
    await mongooseConnect();
    await User.deleteMany({});
    console.log('OK, users deleted');
    process.exit();
  });
//#endregion

cli.help();

try {
  cli.parse();
} catch (err) {
  console.log(err.message);
}