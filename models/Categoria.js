const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaValida = {
  values: [
    'INICIACION',
    'AVANZADO',
    'FORMATIVA',
    '5',
    '4',
    '3',
    '2',
    '1',
    'PROMOCIONAL',
    'NACIONAL',
    'NACIONAL_ELITE',
  ],
  message: '{VALUE} no es un nombre válido',
};

let subCategoriaValida = {
  values: [
    'TOTS',
    'PRE_MINI',
    'INFANTIL',
    'CADETE',
    'JUVENIL',
    'JUNIOR',
    'SENIOR',
    'EDAD',
  ],
};

let categoriaSchema = new Schema({
  categoria: {
    type: String,
    enum: categoriaValida,
    trim: true,
    unique: false,
  },
  subCategoria: {
    type: String,
    enum: subCategoriaValida,
    trim: true,
    unique: false,
  },
});

// MANEJO DE ERRORES UNIQUE
categoriaSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico',
});

module.exports = mongoose.model('Categoria', categoriaSchema);
