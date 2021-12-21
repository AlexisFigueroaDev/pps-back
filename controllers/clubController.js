const clubes = require('./../models/Club');

const agregarClub = async (req, res, next) => {
  const club = new clubes(req.body);
  try {
    await club.save();
    res.status(201).json({
      club,
      message: 'Club creada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al agregar Club',
    });
    next();
  }
};

const listClub = async (req, res, next) => {
  try {
    const club = await clubes.find({});
    res.status(200).json(club);
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al listar los clubes ',
    });
    next();
  }
};

const modificarClub = async (req, res, next) => {
  try {
    const update = {
      nombre: req.body.nombre,
    };

    let club = await clubes.findOneAndUpdate({ _id: req.params.id }, update, {
      new: true,
    });

    res.json({
      club,
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al modificar el club',
    });
    next();
  }
};

const eliminarClub = async (req, res, next) => {
  try {
    await clubes.findByIdAndDelete({ _id: req.params.id });
    res.json({
      ok: true,
      message: 'El club se elimino de forma correcta',
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al eliminar la Division',
    });
  }
};

const buscarClub = async (req, res, next) => {
  try {
    id = req.params.id;

    const club = await clubes.findById(id).populate({
      path: 'montoClub.torneo',
    });
    res.json(club);
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error',
    });
  }
};

module.exports = {
  agregarClub,
  listClub,
  modificarClub,
  eliminarClub,
  buscarClub,
};
