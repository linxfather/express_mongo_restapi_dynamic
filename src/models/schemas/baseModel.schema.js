import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // TODO: empty
});

export const BaseModel = mongoose.model('BaseModel', schema);