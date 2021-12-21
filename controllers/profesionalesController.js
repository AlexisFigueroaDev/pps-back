const { logger } = require('../tools/logger');
const profesor = require('./../models/Profesioanales');

const agregarProfe = async (req, res, next) => {
  const profe = new profesor(req.body);
  try {
    await profe.save();
    res.status(201).json({
      profe,
      message: 'Profesor creador correctamente',
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al crear el profesor',
    });
  }
};

const listProfesor = async (req, res, next) => {
  try {
    const profe = await profesor.find({}).populate({
      path: 'club',
    });
    res.json({
      profe,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al listar los profesores',
    });
  }
};

const modificarProfesor = async (req, res, next) => {
  try {
    const update = {
      nombre: req.body.nombre,
      club: req.body.club,
    };

    let profe = await profesor.findByIdAndUpdate(
      { _id: req.params.id },
      update,
      { new: true }
    );

    res.json({
      profe,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al modificar el profesor',
    });
  }
};

const eliminarProfe = async (req, res, next) => {
  try {
    await profesor.findByIdAndDelete({ _id: req.params.id });
    res.json({
      ok: true,
      message: 'El profesor se elimino de forma correcta',
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al eliminar el profesor',
    });
  }
};

const buscarProfesor = async (req, res, next) => {
  try {
    const profe = await profesor.findById({ _id: req.body.id });
    // .populate({
    //   path: 'club',
    // });
    res.json({
      profe,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al buscar el profesor',
    });
  }
};

const totalProfesores = async (req, res, next) => {
  try {
    const cantidadProfe = await profesor.estimatedDocumentCount();
    res.json(cantidadProfe);
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al contar los profesores',
    });
  }
};

const buscoFilter = async (req, res, mext) => {
  dato = req.body.valor;

  await profesor
    .find({ nombre: { $regex: dato, $options: 'i' } })
    .populate({
      path: 'club',
    })
    .exec((err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    });
};

const findProfesorSingup = async (req, res, next) => {
  let id_usuario = req.body.Usuario;
  let ObjectId = require('mongoose').Types.ObjectId;

  const profe = await profesor
    .find({
      Usuario: ObjectId(id_usuario),
    })
    .populate({
      path: 'club',
    });

  logger.info({
    message: 'Se busco el Profesor logueado',
    profe,
  });

  res.json(profe);
};

module.exports = {
  agregarProfe,
  listProfesor,
  modificarProfesor,
  eliminarProfe,
  buscarProfesor,
  totalProfesores,
  buscoFilter,
  findProfesorSingup,
};
