const especialidad = require('../models/Especialidad');

const agregarEspecialidad = async (req, res, next) => {
  let datoNombre = req.body.nombre;
  datoNombre = datoNombre.toUpperCase();

  nuevo = {
    nombre: datoNombre,
  };

  const Especialidad = new especialidad(nuevo);
  try {
    await Especialidad.save();
    res.status(201).json({
      Especialidad,
      message: 'Especialidad creada correctamente',
    });
  } catch (error) {
    res.json({
      error,
      mensaje: 'no se pudo agregar la especialidad',
    });
  }
};

const listEspecialidad = async (req, res, next) => {
  try {
    const Especialidad = await especialidad.find({});
    res.status(200).json(Especialidad);
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al listar las especialidades',
    });
    next();
  }
};

const modificarEspecialidad = async (req, res, next) => {
  try {
    let datoNombre = req.body.nombre;
    datoNombre = datoNombre.toUpperCase();

    const update = {
      nombre: datoNombre,
    };

    let Especialidad = await especialidad.findOneAndUpdate(
      { _id: req.params.id },
      update,
      { new: true, runValidators: true }
    );

    res.json({
      Especialidad,
    });
  } catch (error) {
    res.json({
      error,
      message: 'hubo un error al modificar la especialidad',
    });
    next();
  }
};

const eliminarEspecialidad = async (req, res, next) => {
  try {
    await especialidad.findByIdAndDelete({ _id: req.params.id });
    res.json({
      ok: true,
      message: 'La especialidad se elimino de forma correcta',
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al eliminar la especialidad',
    });
    next();
  }
};

const buscarEspecialidad = async (req, res, next) => {
  try {
    id = req.params.id;

    const especial = await especialidad.findById(id);
    res.json(especial);
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error',
    });
  }
};

module.exports = {
  agregarEspecialidad,
  listEspecialidad,
  modificarEspecialidad,
  eliminarEspecialidad,
  buscarEspecialidad,
};
