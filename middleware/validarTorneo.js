const torneos = require('./../models/Torneo');
const { logger } = require('../tools/logger');

const findUsuario = (array, usuario) => {
  return array === usuario;
};

const useTorneo = async (req, res, next) => {
  //   let idUsuario = '618c7b9c6a2a0025740c2ad51';
  //   let idTorneo = '61abd8fa054ca3415635ccdc';
  let idUsuario = req.body.idUsuario;
  let idTorneo = req.body.idtorneo;

  let busquedaTorneo = await torneos.findById(idTorneo);

  let array = busquedaTorneo.patinadores;
  let existe = array.find((element) => element == idUsuario);

  if (existe !== undefined) {
    logger.info({
      message: `El usuario ${idUsuario} ya esta inscripto`,
    });
    res.json({
      message: `El usuario ${idUsuario} ya esta inscripto`,
    });
  } else {
    next();
    logger.info({
      message: 'El usuario no esta inscripto continua con el registro ',
    });
  }
};

module.exports = {
  useTorneo,
};
