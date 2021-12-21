const torneo = require('./../models/Torneo');
const patinadores = require('./../models/Patinadores');
const profesionales = require('./../models/Profesioanales');

// cuantos participantes hay en el torneo
const cantPatinadoresTorneo = async (idTorneo) => {
  const cantidad = await torneo.findById({ _id: idTorneo });
  return cantidad.patinadores.length;
};

// array de participantes del torneo
const handdleParticipanteToreno = async (idTorneo) => {
  const array = await torneo
    .findById({ _id: idTorneo })
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

  return array.patinadores;
};

// Armar array por Especialidad
const handdleArrayEspecialidad = (arrayParticipantes) => {
  // busco si existen Especialidad Libre
  let filterLibre = arrayParticipantes.filter(
    (element) => element.Especialidad.nombre == 'LIBRE'
  );

  let filterEscuela = arrayParticipantes.filter(
    (element) => element.Especialidad.nombre == 'ESCUELA'
  );

  return { filterLibre, filterEscuela };
};

// Armar array por division D - C -  B -  A

const handdleArrayDivision = (arrayLibre, arrayEscuela) => {
  //LIBRE
  let filterLibreD = arrayLibre.filter(
    (element) => element.Division.nombre == 'D'
  );
  let filterLibreC = arrayLibre.filter(
    (element) => element.Division.nombre == 'C'
  );
  let filterLibreB = arrayLibre.filter(
    (element) => element.Division.nombre == 'B'
  );
  let filterLibreA = arrayLibre.filter(
    (element) => element.Division.nombre == 'A'
  );

  //ESCUELA
  let filterEscuelaC = arrayEscuela.filter(
    (element) => element.Division.nombre == 'C'
  );
  let filterEscuelaB = arrayEscuela.filter(
    (element) => element.Division.nombre == 'B'
  );
  let filterEscuelaA = arrayEscuela.filter(
    (element) => element.Division.nombre == 'A'
  );

  return {
    filterLibreD,
    filterLibreC,
    filterLibreB,
    filterLibreA,
    filterEscuelaC,
    filterEscuelaB,
    filterEscuelaA,
  };
};

// Armar grupos de X participantes  y separarlos en array
const handdleArrayGroup = (object, cant) => {
  let arr = Object.values(object);

  let turnos = {
    participantes: { data: [], horas: 0 },
  };

  let horas = 1;

  arregloTemporal = [];

  console.log(arr.length);
  for (let i = 0; i < arr.length; i++) {
    let b = i + 1;
    arregloTemporal.push(arr[i].concat(arr[b]));
    i = i;
  }

  arregloTemporal2 = [];
  console.log(arregloTemporal2.length);

  for (let i = 0; i < arregloTemporal.length; i++) {
    let b = i + 1;
    arregloTemporal2.push(arregloTemporal[i].concat(arregloTemporal[b]));
    i = i;
  }

  arregloTemporal3 = [];
  console.log(arregloTemporal3.length);
  for (let i = 0; i < arregloTemporal2.length; i++) {
    let b = i + 1;
    arregloTemporal3.push(arregloTemporal2[i].concat(arregloTemporal2[b]));
    i = i;
  }

  let arreglo = arregloTemporal3[0];

  let arregloArrglo = [];
  let numero = parseInt(cant);
  for (let i = 0; i < arreglo.length; i += numero) {
    let pedazo = arreglo.slice(i, i + numero);
    turnos.participantes.data.push(pedazo);
    turnos.participantes.horas = horas++;
  }

  return turnos;
};

const dividirArray = (array, cant, horas) => {
  let newArray = [];

  let turnos = {
    participantes: { data: [], horas: 0, dias: 0 },
  };
  let dias = 1;
  let newhoras = horas / cant;

  let separacion = parseInt(array.length / cant + 1);

  for (let i = 0; i < array.length; i += separacion) {
    turnos.participantes.data.push(array.slice(i, i + separacion));
    turnos.participantes.dias = dias++;
  }
  turnos.participantes.horas = newhoras;
  return turnos;
};
const planificacionTorneo = async (req, res, next) => {
  let idTorneo = req.body.idTorneo;
  let groupParticipants = req.body.groupParticipants;
  let dias = parseInt(req.body.dias);

  let cantidadTotal = await cantPatinadoresTorneo(idTorneo);
  let participantesInscriptos = await handdleParticipanteToreno(idTorneo);
  let arrayEspecialidad = await handdleArrayEspecialidad(
    participantesInscriptos
  );

  let arrayDivision = await handdleArrayDivision(
    arrayEspecialidad.filterLibre,
    arrayEspecialidad.filterEscuela
  );

  let groupArray = handdleArrayGroup(arrayDivision, groupParticipants);

  switch (dias) {
    case 1:
      res.json(groupArray);
      break;
    case 2:
    case 3:
      let newArray = dividirArray(
        groupArray.participantes.data,
        dias,
        groupArray.participantes.horas
      );
      res.json(newArray);
      break;
  }
};

module.exports = {
  planificacionTorneo,
};
