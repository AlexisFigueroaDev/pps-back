const { logger } = require('../tools/logger');
const patinadores = require('./../models/Patinadores');

const agregarPatinador = async (req, res, next) => {
  const patinador = new patinadores(req.body);
  try {
    await patinador.save();
    res.status(201).json({
      patinador,
      message: 'Patinador creado correctamente',
    });
  } catch (error) {
    res.json({
      error,
      message:
        'No se pudo agregar el patinador, Verifique que todos los campos esten completos',
    });
    next();
  }
};

const listParticipantes = async (req, res, next) => {
  try {
    const Patinadores = await patinadores
      .find({})
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
      });
    res.json({
      Patinadores,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al listar los patinadores',
    });
  }
};

const modificarParticipante = async (req, res, next) => {
  try {
    const update = {
      nombre: req.body.nombre,
      edad: req.body.edad,
      club: req.body.club,
      Especialidad: req.body.Especialidad,
      Division: req.body.Division,
      Categoria: req.body.Categoria,
    };

    let Patinadores = await patinadores.findOneAndUpdate(
      { _id: req.params.id },
      update,
      {
        new: true,
      }
    );

    res.json({
      Patinadores,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al modificar el participante',
    });
  }
};

const eliminarParticipante = async (req, res, next) => {
  try {
    await patinadores.findByIdAndDelete({ _id: req.params.id });
    res.json({
      ok: true,
      message: 'El patinador se elimino de forma correcta',
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al eliminar el participante',
    });
    next();
  }
};

const buscarPatinador = async (req, res, next) => {
  const id = req.body.id;
  try {
    const Patinador = await patinadores.findById({ _id: id });
    // .populate({
    //   path: 'club',
    // })
    // .populate({
    //   path: 'Especialidad',
    // })
    // .populate({
    //   path: 'Division',
    // })
    // .populate({
    //   path: 'Categoria',
    // });
    res.json({
      Patinador,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al buscar el participante',
    });
  }
};

const cantParticipantes = async (req, res, next) => {
  try {
    const cantParticipante = await patinadores.estimatedDocumentCount();
    res.json(cantParticipante);
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al contar los profesores',
    });
  }
};

const buscoFiltroPatinador = async (req, res, mext) => {
  dato = req.body.valor;

  await patinadores
    .find({
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
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    });
};

const buscoFiltroPatinador2 = async (req, res, mext) => {
  dato = req.body.valor;

  await patinadores
    .find({
      $and: [
        { nombre: { $regex: dato, $options: 'i' } },
        { 'MontoPatinador.importe': { $gte: 100 } },
      ],
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
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    });
};

// patinador logueado

const findPatinadorSingup = async (req, res, next) => {
  let id_usuario = req.body.Usuario;
  let ObjectId = require('mongoose').Types.ObjectId;

  const participante = await patinadores
    .find({
      Usuario: ObjectId(id_usuario),
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
    });

  logger.info({
    message: 'Se busco el participante logueado',
    participante,
  });

  res.json(participante);
};

const buscarPatinadorCompleto = async (req, res, next) => {
  const id = req.body.id;
  try {
    const Patinador = await patinadores
      .findById({ _id: id })
      .populate({
        path: 'club',
        populate: {
          path: 'montoClub.torneo',
        },
      })
      // .populate('club.montoClub.torneo')
      .populate({
        path: 'Especialidad',
      })
      .populate({
        path: 'Division',
      })
      .populate({
        path: 'Categoria',
      })
      .populate('MontoPatinador.torneo');
    res.json({
      Patinador,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al buscar el participante',
    });
  }
};

module.exports = {
  agregarPatinador,
  listParticipantes,
  modificarParticipante,
  eliminarParticipante,
  buscarPatinador,
  cantParticipantes,
  buscoFiltroPatinador,
  buscoFiltroPatinador2,
  findPatinadorSingup,
  buscarPatinadorCompleto,
};
