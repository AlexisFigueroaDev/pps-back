const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let especialidadValidad = {
  values: ['LIBRE', 'ESCUELA'],
  message: '{VALUE} no es un nombre válido',
};

let especialidadSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la especialidad es requerido'],
    unique: true,
    enum: especialidadValidad,
  },
});

//MANEJO DE ERRORES UNIQUE
especialidadSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico',
});

module.exports = mongoose.model('Especialidades', especialidadSchema);
