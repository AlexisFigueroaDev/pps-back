const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validacionCode = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  codigo: {
    type: Number,
    trim: true,
  },
});

module.exports = mongoose.model('codigos', validacionCode);
