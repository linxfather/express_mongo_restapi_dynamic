import mongoose from 'mongoose';
import {
  commonEmailRegEx,
  commonIsPassword
} from '../../../utils/common.js';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [commonEmailRegEx, ' ']
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: commonIsPassword,
      message: ' '
    }
  }
});

export const User = mongoose.model('User', schema);