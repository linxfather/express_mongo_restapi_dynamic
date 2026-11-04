import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // category: {
  //   type: String,
  //   required: true,
  // },
  title: {
    type: String,
    required: true,
    unique: true
  },
  // description: {
  //   type: String,
  //   required: true
  // },
  price: {
    type: Number,
    required: true
  },
  cartCount: {
    type: Number
  }
});

export const Product = mongoose.model('Product', schema);