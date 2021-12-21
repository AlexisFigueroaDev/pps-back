const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let divisionValida = {
  values: ['D', 'C', 'B', 'A'],
  message: '{VALUE} no es un nombre válido',
};

let divisionSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la division es requerido'],
    unique: true,
    enum: divisionValida,
  },
});

//MANEJO DE ERRORES UNIQUE
divisionSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico',
});

module.exports = mongoose.model('Division', divisionSchema);
