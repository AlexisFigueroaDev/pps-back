const validateCategorias = (req, res, next) => {
  categoria = req.body.categoria;
  subCategoria = req.body.subCategoria;
  // categoria = 'NACIONAL_ELITE';
  // subCategoria = 'TOTS';

  const onlyNumber = /^[0-9]*$/;
  const categoryAge = [
    'INICIACION',
    'AVANZADO',
    'FORMATIVA',
    '5',
    '4',
    '3',
    '2',
    '1',
    'PROMOCIONAL',
  ];
  const subCategoty = {
    Nacional: [
      'TOTS',
      'PRE_MINI',
      'INFANTIL',
      'CADETE',
      'JUVENIL',
      'JUNIOR',
      'SENIOR',
    ],
    NACIONAL_ELITE: ['CADETE', 'JUVENIL', 'JUNIOR', 'SENIOR'],
  };

  /*
   *
   *
   *  VALIDO QUE SOLO EL VALOR SEA NUMERICO
   *
   *
   */
  const validateNumber = (valor) => {
    const resultado = onlyNumber.test(valor);
    return resultado;
  };

  /*
   *
   *
   *  VALIDO CATEGORIA CON SUBCATEGORIAS
   *
   *
   */
  const validateSubcategoty = (parametro, subParameter) => {
    let resultado = false;
    if (parametro == 'NACIONAL') {
      let valor = subCategoty.Nacional.filter((valor) => valor == subParameter);
      if (valor.length !== 0) {
        return (resultado = true);
      }
    }
    if (parametro == 'NACIONAL_ELITE') {
      let valor = subCategoty.NACIONAL_ELITE.filter(
        (valor) => valor == subParameter
      );
      if (valor.length !== 0) {
        return (resultado = true);
      }
    }

    return resultado;
  };

  /*
   *
   *
   *  VALIDO SI CORRESPONDE EDAD O VALIDA LAS CATEGORIA CON SUBCATEGORIAS
   *
   *
   */

  function haveAge(parametro, subParametro) {
    let resultado;
    const valorBuscado = categoryAge.filter((valor) => valor == parametro);

    if (valorBuscado.length == 1) {
      if (subCategoria == 'EDAD') {
        resultado = 0;
      } else {
        resultado = -1;
      }
    } else {
      if (validateSubcategoty(parametro, subParametro)) {
        resultado = 0;
      } else {
        resultado = -2;
      }
    }

    return resultado;
  }

  let validaciones = haveAge(categoria, subCategoria);

  if (validaciones == 0) {
    next();
  } else {
    res.json({
      validaciones,
      message: 'Hubo un error en la relacion entre categoria y subCategoria',
    });
  }
};

module.exports = {
  validateCategorias,
};
