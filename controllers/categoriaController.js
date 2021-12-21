const categorias = require('./../models/Categoria');

const agregarCategoria = async (req, res, next) => {
  const categoria = new categorias(req.body);

  try {
    await categoria.save();
    res.status(201).json({
      categoria,
      message: 'Categoria creada correctamente',
    });
  } catch (error) {
    res.json({
      error,
      message: 'Hubo un error al agregar la categoria',
    });
  }
};

const listCategoria = async (req, res, next) => {
  try {
    const Categoria = await categorias.find({});
    res.status(200).json({
      Categoria,
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al listar la categoria ',
    });
    next();
  }
};

const modificarCategoria = async (req, res, next) => {
  try {
    const update = {
      categoria: req.body.categoria,
      subCategoria: req.body.subCategoria,
    };

    let Categoria = await categorias.findOneAndUpdate(
      { _id: req.params.id },
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      Categoria,
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: 'Hubo un error al modificar la categoria',
    });
    next();
  }
};

const eliminarCategoria = async (req, res, next) => {
  try {
    await categorias.findByIdAndDelete({ _id: req.params.id });
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

const buscarExistencia = async (req, res, next) => {
  dato = req.body.valor;

  await categorias
    .find({ categoria: { $regex: dato, $options: 'i' } })
    // .or({ subCategoria: { $regex: dato, $options: 'i' } })
    .exec((err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    });
};

const buscoCategoria = async (req, res, next) => {
  try {
    id = req.params.id;

    const cate = await categorias.findById(id);
    res.json(cate);
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error al buscar la categoria',
    });
  }
};

const searchCategory = async (req, res, next) => {
  id = req.body.id;
  try {
    categoty = await categorias.findById({ _id: id });
    res.json(categoty);
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un errror al buscar la categoria',
    });
  }
};

module.exports = {
  agregarCategoria,
  listCategoria,
  modificarCategoria,
  eliminarCategoria,
  buscarExistencia,
  buscoCategoria,
  searchCategory,
};
