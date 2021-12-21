const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let torneoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del Torneo es requerido'],
    unique: true,
  },
  fecha: {
    type: String,
    required: [true, 'La Fecha del Torneo es requerido'],
  },
  cantidad: {
    type: String,
    required: [true, 'La cantidad del Torneo es requerido'],
  },
  patinadores: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Patinadores',
    },
  ],
  valorTorneo: {
    type: Number,
    default: 0.0,
  },
  montoTorneo: {
    type: Number,
    default: 0.0,
  },
});

//MANEJO DE ERRORES UNIQUE
torneoSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico',
});

module.exports = mongoose.model('Torneo', torneoSchema);
