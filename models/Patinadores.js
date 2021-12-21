const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let patinadoresSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del patinador es requerido'],
  },
  edad: {
    type: String,
    // required: [true, 'La edad del patinador es requerido'],
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    // required: [true, 'El id del club es obligatorio'],
  },
  Especialidad: {
    type: Schema.Types.ObjectId,
    ref: 'Especialidades',
    // required: [true, 'El id de Especialidad es requerido'],
  },
  Division: {
    type: Schema.Types.ObjectId,
    ref: 'Division',
    // required: [true, 'El id de Division es requerido'],
  },
  Categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    // required: [true, 'El id de Categoria es requerido'],
  },
  Usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuarios',
  },
  MontoPatinador: [
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

module.exports = mongoose.model('Patinadores', patinadoresSchema);
