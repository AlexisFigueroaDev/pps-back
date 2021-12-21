const division = require('./../models/Division');

const agregarDivision = async (req, res, next) => {
  const Division = new division(req.body);
  try {
    await Division.save();
    res.status(201).json({
      Division,
      message: 'Division creada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error',
    });
    next();
  }
};

const listDivision = async (req, res, next) => {
  try {
    const Division = await division.find({});
    res.status(200).json(Division);
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al listar la division ',
    });
    next();
  }
};

const modificarDivision = async (req, res, next) => {
  let dato = req.body.nombre;
  dato = dato.toUpperCase();

  try {
    const update = {
      nombre: dato,
    };

    let Division = await division.findOneAndUpdate(
      { _id: req.params.id },
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      Division,
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al modificar la division',
    });
  }
};

const eliminarDivision = async (req, res, next) => {
  try {
    await division.findByIdAndDelete({ _id: req.params.id });
    res.json({
      ok: true,
      message: 'La division se elimino de forma correcta',
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al eliminar la Division',
    });
  }
};
const buscarDivision = async (req, res, next) => {
  try {
    id = req.params.id;

    const Division = await division.findById(id);
    res.json(Division);
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error',
    });
  }
};

module.exports = {
  agregarDivision,
  listDivision,
  modificarDivision,
  eliminarDivision,
  buscarDivision,
};
