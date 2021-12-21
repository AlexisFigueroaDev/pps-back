const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let clubSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del club es requerido'],
    unique: true,
  },
  montoClub: [
    {
      importe: {
        type: Number,
        default: 0.0,
      },
      torneo: {
        type: Schema.Types.ObjectId,
        ref: 'Torneo',
      },
    },
  ],
});

//MANEJO DE ERRORES UNIQUE
clubSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico',
});

module.exports = mongoose.model('Club', clubSchema);
