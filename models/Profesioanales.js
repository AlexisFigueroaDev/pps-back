const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let profesionalesSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del tecnico es requerido'],
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    // required: [true, 'El id del club es obligatorio'],
  },
  Usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuarios',
  },
});

module.exports = mongoose.model('Profesionales', profesionalesSchema);
