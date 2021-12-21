const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

let rolesValidos = {
  values: ['ADMIN', 'PARTICIPANTE', 'PROFESOR'],
  message: '{VALUE} no es un rol válido',
};

const usuariosSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'El password es requerido'],
    trim: true,
  },
  role: {
    type: String,
    default: 'PROFESOR',
    enum: rolesValidos,
    trim: true,
  },
  google: {
    type: Boolean,
    default: false,
    trim: true,
  },
  img: {
    type: String,
    required: false,
  },
});

//MANEJO DE ERRORES UNIQUE
usuariosSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico',
});

usuariosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Usuarios', usuariosSchema);
