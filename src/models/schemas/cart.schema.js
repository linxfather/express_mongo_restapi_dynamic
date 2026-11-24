import mongoose from 'mongoose';
import { Product } from './product.schema.js';
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  product: {
    type: ObjectId,
    ref: 'Product',
    required: true
  },
  count: {
    type: Number,
    required: true,
    min: 1
  }
});

export const Cart = mongoose.model('Cart', schema);