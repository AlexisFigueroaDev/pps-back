const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { logger } = require('./tools/logger');
// require('./config');
// Cors permite que un cliente se conecta a otro servidor para el intercambio de recursos

const cors = require('cors');

// conectar mongo
// const uri =
//   'mongodb+srv://pps-data:teclado2@cluster0.fu4gm.mongodb.net/ppsdb?retryWrites=true&w=majority';

//dev  : ppsdb
//beta : ppsdb-beta

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ppsdb', {
  useNewUrlParser: true,
});

// crear el servidor
const app = express();

// habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar cors
app.use(cors());

// Rutas de la app

app.use('/', routes());

// carpeta publica
// app.use(express.static('uploads'));

// puerto
app.listen(5000, () => {
  console.log('Conectado al puerto 5000');
  logger.info(`Conectado al puerto 5000`);
});
