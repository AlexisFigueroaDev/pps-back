const especialidad = require('./../models/Especialidad');
const division = require('./../models/Division');
const categoria = require('./../models/Categoria');

const validateParticipante = async (req, res, next) => {
  //tomo los datos a validar
  const id_Especialidad = req.body.Especialidad;
  const id_Division = req.body.Division;
  const id_Categoria = req.body.Categoria;

  const subCategoty = {
    Nacional: [
      'TOTS',
      'PRE_MINI',
      'INFANTIL',
      'CADETE',
      'JUVENIL',
      'JUNIOR',
      'SENIOR',
      'EDAD',
    ],
    NACIONAL_ELITE: ['CADETE', 'JUVENIL', 'JUNIOR', 'SENIOR'],
    B: ['5', '4', '3', '2', '1', 'PROMOCIONAL'],
    C: ['5', '4', '3', '2', '1', 'FORMATIVA'],
    D: ['AVANZADO', 'INICIACION'],
  };

  const validate = () => {
    let valido =
      id_Especialidad !== undefined &&
      id_Division !== undefined &&
      id_Categoria !== undefined;

    return valido;
  };

  let valido = validate();

  if (valido) {
    // busco la especialidad
    await especialidad.findById(id_Especialidad).exec((err, especialidadDB) => {
      try {
        let valorBuscadoEspecialidad = especialidadDB.nombre;

        if (valorBuscadoEspecialidad == 'ESCUELA') {
          // busco la division
          division.findById(id_Division).exec((err, divisionDB) => {
            try {
              let valorBuscadoDivision = divisionDB.nombre;

              if (valorBuscadoDivision !== 'D') {
                // busco la categoria

                if (valorBuscadoDivision == 'A') {
                  categoria.findById(id_Categoria).exec((err, categoriaDB) => {
                    try {
                      let valorBuscadoCategoria = categoriaDB.categoria;
                      let valorBuscadoSubCategoria = categoriaDB.subCategoria;

                      if (valorBuscadoCategoria == 'NACIONAL') {
                        let existe = subCategoty.Nacional.filter(
                          (valor) => valor == valorBuscadoSubCategoria
                        );

                        if (existe.length !== 0) {
                          next();
                        } else {
                          res.json({
                            message:
                              'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                          });
                        }
                      } else if (valorBuscadoCategoria == 'NACIONAL_ELITE') {
                        let existe = subCategoty.NACIONAL_ELITE.filter(
                          (valor) => valor == valorBuscadoSubCategoria
                        );

                        if (existe.length !== 0) {
                          next();
                        } else {
                          res.json({
                            message:
                              'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                          });
                        }
                      } else {
                        res.json({
                          message:
                            'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                        });
                      }
                    } catch (error) {
                      res.json({
                        message:
                          'La Categoria no puede estar vacia o no existe',
                      });
                    }
                  });
                } else if (valorBuscadoDivision == 'B') {
                  categoria.findById(id_Categoria).exec((err, categoriaDB) => {
                    try {
                      let valorBuscadoCategoria = categoriaDB.categoria;
                      let valorBuscadoSubCategoria = categoriaDB.subCategoria;

                      let existe = subCategoty.B.filter(
                        (valor) => valor == valorBuscadoCategoria
                      );

                      if (existe.length !== 0) {
                        next();
                      } else {
                        res.json({
                          message:
                            'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                        });
                      }
                    } catch (error) {
                      res.json({
                        message:
                          'La Categoria no puede estar vacia o no existe',
                      });
                    }
                  });
                } else if (valorBuscadoDivision == 'C') {
                  categoria.findById(id_Categoria).exec((err, categoriaDB) => {
                    try {
                      let valorBuscadoCategoria = categoriaDB.categoria;
                      let valorBuscadoSubCategoria = categoriaDB.subCategoria;

                      let existe = subCategoty.C.filter(
                        (valor) => valor == valorBuscadoCategoria
                      );

                      if (existe.length !== 0) {
                        next();
                      } else {
                        res.json({
                          message:
                            'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                        });
                      }
                    } catch (error) {
                      res.json({
                        message:
                          'La Categoria no puede estar vacia o no existe',
                      });
                    }
                  });
                }
              } else {
                res.json({
                  message:
                    'Error al inscribir el participante con la ESPECIALDIAD  y la DIVISION',
                });
              }
            } catch (error) {
              res.json({
                message: 'La Division no puede estar vacia o no existe',
              });
            }
          });
        } else if (valorBuscadoEspecialidad == 'LIBRE') {
          // LIBRE
          // busco la division
          division.findById(id_Division).exec((err, divisionDB) => {
            try {
              let valorBuscadoDivision = divisionDB.nombre;

              // if (valorBuscadoDivision !== 'D') {
              // busco la categoria

              if (valorBuscadoDivision == 'A') {
                categoria.findById(id_Categoria).exec((err, categoriaDB) => {
                  try {
                    let valorBuscadoCategoria = categoriaDB.categoria;
                    let valorBuscadoSubCategoria = categoriaDB.subCategoria;

                    if (valorBuscadoCategoria == 'NACIONAL') {
                      let existe = subCategoty.Nacional.filter(
                        (valor) => valor == valorBuscadoSubCategoria
                      );

                      if (existe.length !== 0) {
                        next();
                      } else {
                        res.json({
                          message:
                            'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                        });
                      }
                    } else if (valorBuscadoCategoria == 'NACIONAL_ELITE') {
                      let existe = subCategoty.NACIONAL_ELITE.filter(
                        (valor) => valor == valorBuscadoSubCategoria
                      );

                      if (existe.length !== 0) {
                        next();
                      } else {
                        res.json({
                          message:
                            'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                        });
                      }
                    } else {
                      res.json({
                        message:
                          'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                      });
                    }
                  } catch (error) {
                    res.json({
                      message: 'La Categoria no puede estar vacia o no existe',
                    });
                  }
                });
              } else if (valorBuscadoDivision == 'B') {
                categoria.findById(id_Categoria).exec((err, categoriaDB) => {
                  try {
                    let valorBuscadoCategoria = categoriaDB.categoria;
                    let valorBuscadoSubCategoria = categoriaDB.subCategoria;

                    let existe = subCategoty.B.filter(
                      (valor) => valor == valorBuscadoCategoria
                    );

                    if (existe.length !== 0) {
                      next();
                    } else {
                      res.json({
                        message:
                          'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                      });
                    }
                  } catch (error) {
                    res.json({
                      message: 'La Categoria no puede estar vacia o no existe',
                    });
                  }
                });
              } else if (valorBuscadoDivision == 'C') {
                categoria.findById(id_Categoria).exec((err, categoriaDB) => {
                  try {
                    let valorBuscadoCategoria = categoriaDB.categoria;
                    let valorBuscadoSubCategoria = categoriaDB.subCategoria;

                    let existe = subCategoty.C.filter(
                      (valor) => valor == valorBuscadoCategoria
                    );

                    if (existe.length !== 0) {
                      next();
                    } else {
                      res.json({
                        message:
                          'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                      });
                    }
                  } catch (error) {
                    res.json({
                      message: 'La Categoria no puede estar vacia o no existe',
                    });
                  }
                });
              } else if (valorBuscadoDivision == 'D') {
                categoria.findById(id_Categoria).exec((err, categoriaDB) => {
                  try {
                    let valorBuscadoCategoria = categoriaDB.categoria;
                    let valorBuscadoSubCategoria = categoriaDB.subCategoria;

                    let existe = subCategoty.D.filter(
                      (valor) => valor == valorBuscadoCategoria
                    );

                    if (existe.length !== 0) {
                      next();
                    } else {
                      res.json({
                        message:
                          'Error al inscribir el participante con la CATEGORIA  y la SUBCATEGORIA',
                      });
                    }
                  } catch (error) {
                    res.json({
                      message: 'La Categoria no puede estar vacia o no existe',
                    });
                  }
                });
              } else {
                res.json({
                  message: 'ERROR FATAL',
                });
              }
            } catch (error) {
              res.json({
                message: 'La Division no puede estar vacia o no existe',
              });
            }
          });
        }
      } catch (error) {
        res.json({
          message: 'La Especialidad no puede estar vacia o no existe',
        });
      }
    });
  } else {
    res.json({ message: 'Todos los campos son obligatorios' });
  }
};

module.exports = {
  validateParticipante,
};
