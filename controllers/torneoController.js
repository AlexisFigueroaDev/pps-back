const torneo = require('./../models/Torneo');
const club = require('./../models/Club');
const patinadores = require('./../models/Patinadores');
const { logger } = require('../tools/logger');
const Patinadores = require('./../models/Patinadores');

// Agregar Torneo
const agregarTorneo = async (req, res) => {
  const newTorneo = new torneo(req.body);
  try {
    await newTorneo.save();
    logger.info({
      message: 'Se agrego nuevo torneo',
      newTorneo,
    });
    res.json(newTorneo);
  } catch (error) {
    res.json(error);
    logger.info({
      message: 'Error al agregar nuevo torneo',
      error,
    });
  }
};

// Find torneo
const findTorneo = async (req, res) => {
  try {
    const torneos = await torneo
      .find({})
      .populate({
        path: 'patinadores',
        populate: {
          path: 'club',
        },
      })
      .populate({
        path: 'patinadores',
        populate: {
          path: 'Especialidad',
        },
      })
      .populate({
        path: 'patinadores',
        populate: {
          path: 'Division',
        },
      })
      .populate({
        path: 'patinadores',
        populate: {
          path: 'Categoria',
        },
      });
    res.json(torneos);
    logger.info({
      message: 'Listado de torneos',
      torneos,
    });
  } catch (error) {
    res.json(error);
    logger.info({
      message: 'Error al listar torneos',
      error,
    });
  }
};

// agregar Patinadores al torneo
const participanteTorneo = async (req, res) => {
  let id_torneo = req.body.idtorneo;
  let id_usuario = req.body.idUsuario;
  let ObjectId = require('mongoose').Types.ObjectId;

  if (id_torneo !== undefined && id_usuario !== undefined) {
    try {
      //Busco Datos del Torneo
      let busquedaTorneo = await torneo.findById(id_torneo);
      let cantidad = busquedaTorneo.cantidad;
      let newCantidad = cantidad - 1;
      let precioTorneo = busquedaTorneo.valorTorneo;
      let newMonto = busquedaTorneo.montoTorneo + precioTorneo;

      //Agrego el participante al TORNEO y descuento un cupo
      let participantTorneo = await torneo.findOneAndUpdate(
        { _id: id_torneo },
        {
          $push: { patinadores: ObjectId(id_usuario) },
          cantidad: newCantidad,
          montoTorneo: newMonto,
        },
        {
          new: true,
        }
      );

      logger.info({
        message:
          'Se actualizo Torneo agregando el participante  descontando la cantidad y aumentando el monto ',
        participantTorneo,
      });
      //actualizo el importe al PARTICIPANTE
      let buscoPatinador = await patinadores.findById({ _id: id_usuario });

      let UpdatepatinadorTorneo = await patinadores.findOneAndUpdate(
        { _id: id_usuario },
        {
          $push: {
            MontoPatinador: {
              importe: precioTorneo,
              torneo: id_torneo,
            },
          },
        },
        {
          new: true,
        }
      );
      logger.info({
        message:
          'Se actualizo patinadores agregando el torneo y el monto a pagar por torneo ',
        UpdatepatinadorTorneo,
      });

      //acumulo monto en CLUB del participante
      let IdClub = buscoPatinador.club;
      let buscoClub = await club.findById({ _id: IdClub });
      let array = buscoClub.montoClub;

      let existe = array.find((element) => element.torneo == id_torneo);

      if (existe !== undefined) {
        let monto = existe.importe;
        let indexArray = array.indexOf(
          array.find((element) => element.torneo == id_torneo)
        );
        let idClubTorneo = buscoClub.montoClub[indexArray]._id;
        let torneoClub = await club.find({
          'montoClub._id': idClubTorneo,
        });

        let MontotorneoClub = torneoClub[0].montoClub[indexArray].importe;

        let newMontoTorneoClub = MontotorneoClub + precioTorneo;

        let data = await club.find({ 'montoClub._id': idClubTorneo });

        let updateClubTorneo = await club.updateOne(
          { 'montoClub._id': idClubTorneo },
          {
            $set: {
              'montoClub.$[elem].importe': newMontoTorneoClub,
            },
          },
          {
            new: true,
            arrayFilters: [
              {
                'elem._id': idClubTorneo,
              },
            ],
          }
        );

        logger.info({
          message:
            'Se actualizo Club agregando el torneo y el monto a pagar por torneo ',
          updateClubTorneo,
        });
      } else {
        let updateClubTorneo = await club.findOneAndUpdate(
          { _id: IdClub },
          {
            $push: {
              montoClub: {
                importe: precioTorneo,
                torneo: id_torneo,
              },
            },
          },
          {
            new: true,
          }
        );

        logger.info({
          message:
            'Se actualizo Club agregando el torneo y el monto a pagar por torneo ',
          updateClubTorneo,
        });
      }
      // }

      logger.info({
        message: `Se inscribio el participante ${id_usuario} al torneo ${id_torneo}`,
        // participantTorneo,
      });
      res.json(
        `Se inscribio el participante ${id_usuario} al torneo ${id_torneo}`
      );
    } catch (error) {
      res.json({
        message: 'Hubo un error al inscribir el participante',
        error,
      });
      logger.info({
        message: 'Hubo un error al inscribir el participante',
        error,
      });
    }
  } else {
    res.json({
      message: 'Los datos deben estar completos',
    });
  }
};

const modificarTorneo = async (req, res, next) => {
  let idTorneo = req.body.idTorneo;
  try {
    const update = {
      nombre: req.body.nombre,
      fecha: req.body.fecha,
      cantidad: req.body.cantidad,
    };

    let modTorneo = await torneo.findOneAndUpdate({ _id: idTorneo }, update, {
      new: true,
    });
    res.json(modTorneo);
    logger.info({
      message: 'Se modifico el torneo',
      modTorneo,
    });
  } catch (error) {
    logger.info({
      message: 'Hubo un error al modificar el torneo',
      error,
    });
    res.json({ message: 'Hubo un error al modificar el torneo', error });
  }
};

const eliminarElementoArray = (arr, item) => {
  var i = arr.indexOf(item);
  i !== -1 && arr.splice(i, 1);
};

const eliminarParticipanteTorneo = async (req, res, next) => {
  let idTorneo = req.body.idTorneo;
  let idParticipante = req.body.idParticipante;

  let busquedaTorneo = await torneo.findById(idTorneo);

  let array = busquedaTorneo.patinadores;

  eliminarElementoArray(array, idParticipante);

  const update = {
    patinadores: array,
  };
  try {
    let modTorneo = await torneo.findOneAndUpdate({ _id: idTorneo }, update, {
      new: true,
    });
    res.json(modTorneo);
    logger.info({
      message: `Se elimino el participante ${idParticipante} del torneo ${idtorneo}`,
      modTorneo,
    });
  } catch (error) {
    logger.info({
      message: 'Hubo un error al eliminar el participante del torneo',
      error,
    });
    res.json({
      message: 'Hubo un error al eliminar el participante del torneo',
      error,
    });
  }
};

const eliminarTorneo = async (req, res) => {
  let idTorneo = req.params.idTorneo;

  try {
    await torneo.findByIdAndDelete({ _id: idTorneo });
    logger.info({
      message: 'El torneo se elimino de forma correcta',
      ok: true,
    });
    res.json({
      ok: true,
      message: 'El torneo se elimino de forma correcta',
    });
  } catch (error) {
    logger.info({
      message: 'Hubo un error al eliminar el torneo',
      ok: false,
    });
    res.json({
      error,
      message: 'Hubo un error al eliminar el torneo',
    });
  }
};

const patinadorInscripto = async (req, res) => {
  let idTorneo = req.body.idTorneo;
  let idPatinador = req.body.idPatinador;

  const patinadorTorneo = await torneo.findById({ _id: idTorneo });

  let array = patinadorTorneo.patinadores;
  let existe = array.find((element) => element == idPatinador);

  if (existe !== undefined) {
    logger.info({
      message: `El patinador ${idPatinador} ya esta inscripto`,
    });
    res.json({
      inscripto: true,
      message: `El patinador ${idPatinador} ya esta inscripto`,
    });
  } else {
    res.json({
      inscripto: false,
      message: `El patinador ${idPatinador} no esta inscripto`,
    });
    logger.info({
      message: `El patinador ${idPatinador} no esta inscripto`,
    });
  }
};

const patinadoresInscriptos = async (req, res) => {
  let idTorneo = req.body.idTorneo;
  let dato = req.body.valor;

  try {
    const patinadorFIltro = await Patinadores.find({
      nombre: { $regex: dato, $options: 'i' },
    })
      .populate({
        path: 'club',
      })
      .populate({
        path: 'Especialidad',
      })
      .populate({
        path: 'Division',
      })
      .populate({
        path: 'Categoria',
      })
      .exec((err, data) => {
        console.log(data);
        console.log(data);
      });

    // console.log(patinadorFiltro);

    const patinadoresTorneo = await torneo
      .find(
        { _id: idTorneo }
        //  || {
        // { patinadores: { nombre: { $regex: dato, $options: 'i' } } }
        // },
      )
      .populate({ path: 'patinadores' });

    // res.json(patinadoresTorneo);
    // logger.info({
    //   message: 'Patinadores Inscriptos',
    //   patinadoresTorneo,
    // });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al listar los patinadores Inscriptos',
    });
    logger.info({
      error,
      message: 'Hubo un error al listar los patinadores Inscriptos',
    });
  }
};

const validarDisponibilidad = async (req, res) => {
  id_torneo = req.body.id_torneo;

  let busquedaTorneo = await torneo.findById(id_torneo);

  let cantidad = busquedaTorneo.cantidad;

  if (cantidad == 0) {
    logger.info({
      message: 'No hay cupos disponibles',
    });
    res.json({
      ok: false,
      message: 'No hay cupos disponibles',
    });
  } else {
    logger.info({
      message: 'hay cupos disponibles',
    });
    res.json({
      ok: true,
      message: 'hay cupos disponibles',
    });
  }
};

// Torneo simple
const findTorneo2 = async (req, res) => {
  try {
    const torneos = await torneo.find({});

    res.json(torneos);
    logger.info({
      message: 'Listado de torneo Simple',
      torneos,
    });
  } catch (error) {
    res.json(error);
    logger.info({
      message: 'Error al listar torneos',
      error,
    });
  }
};

const buscarTorneo = async (req, res) => {
  try {
    const torneos = await torneo.findById({ _id: req.params.id });

    res.json(torneos);
    logger.info({
      message: 'Buscando un torneo',
      torneos,
    });
  } catch (error) {
    res.json(error);
    logger.info({
      message: 'Error al Buscar torneos',
      error,
    });
  }
};
module.exports = {
  agregarTorneo,
  findTorneo,
  participanteTorneo,
  modificarTorneo,
  eliminarParticipanteTorneo,
  eliminarTorneo,
  patinadorInscripto,
  patinadoresInscriptos,
  validarDisponibilidad,
  findTorneo2,
  buscarTorneo,
};
