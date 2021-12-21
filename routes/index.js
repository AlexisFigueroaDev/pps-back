const express = require('express');
const {
  agregarCategoria,
  listCategoria,
  modificarCategoria,
  eliminarCategoria,
  buscarExistencia,
  buscoCategoria,
  searchCategory,
} = require('../controllers/categoriaController');
const {
  agregarClub,
  listClub,
  modificarClub,
  eliminarClub,
  buscarClub,
} = require('../controllers/clubController');
const {
  agregarDivision,
  listDivision,
  modificarDivision,
  eliminarDivision,
  buscarDivision,
} = require('../controllers/divisionController');
const {
  agregarEspecialidad,
  listEspecialidad,
  modificarEspecialidad,
  eliminarEspecialidad,
  buscarEspecialidad,
} = require('../controllers/especialidadController');
const {
  agregarPatinador,
  listParticipantes,
  modificarParticipante,
  eliminarParticipante,
  buscarPatinador,
  cantParticipantes,
  buscoFiltroPatinador,
  findPatinadorSingup,
  buscarPatinadorCompleto,
  buscoFiltroPatinador2,
} = require('../controllers/patinadoresController');
const {
  planificacionTorneo,
} = require('../controllers/PlanificacionController');
const {
  agregarProfe,
  listProfesor,
  modificarProfesor,
  eliminarProfe,
  buscarProfesor,
  totalProfesores,
  buscoFilter,
  findProfesorSingup,
} = require('../controllers/profesionalesController');
const {
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
} = require('../controllers/torneoController');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const {
  participantesProfeEqlClub,
  clubProfesoresParticipantes,
} = require('../hooks/relationship');

// middle para proteger las rutas
const auth = require('../middleware/auth');
const { useTorneo } = require('../middleware/validarTorneo');
const { validateCategorias } = require('../middleware/validateCategorias');
const { validateParticipante } = require('../middleware/validatePartipante');
const {
  envioEmail,
  validoCodigo,
  correoConsulta,
} = require('../tools/envioMails');

module.exports = function () {
  // Iniciar sesion
  router.post(
    '/iniciar-sesion',
    // auth.verificarToken,
    usuariosController.autenticarUsuario
  );

  router.post('/iniciar-google', usuariosController.autenticarUsuarioGoogle);
  // que tipo de usuario esta logueado
  router.get('/whoami', auth.whoami);

  //datos user
  router.get('/datosuser', auth.datosUser);

  /*
   *
   * Usuarios
   *
   */

  // Crear usuario
  router.post('/crear-cuenta', usuariosController.registrarUsuario);

  // Todos los usuarios por paginas
  router.get(
    '/getusuarios/:id',
    auth.verificarToken,
    usuariosController.getUsuarios
  );
  // Eliminar usuarios
  router.delete(
    '/usuario/eliminar/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    usuariosController.eliminarUsuario
  );

  router.get(
    '/usuario/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    usuariosController.buscarUsuario
  );
  // Modificar Usuario

  router.put(
    '/usuario/editar/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    usuariosController.modificarUsuario
  );

  // Todos los usuarios
  router.get(
    '/usuarios',
    [auth.verificarRolAdmin, auth.verificarToken],
    usuariosController.usuarios
  );

  // cambiar contraseña
  router.post('/password', usuariosController.cambiarPassword);

  /*
   *
   * Especialidad
   *
   */

  //Agregar Especialidad
  router.post(
    '/especialidad',
    [auth.verificarRolAdmin, auth.verificarToken],
    agregarEspecialidad
  );

  //Listar Especialidades
  router.get('/list-especialidad', auth.verificarToken, listEspecialidad);

  // Modificar Especialidad
  router.put(
    '/especialidad/:id',
    [auth.verificarRolAdmin, auth.verificarToken],
    modificarEspecialidad
  );

  // Eliminar la especialidad
  router.delete(
    '/especialidad/:id',
    [auth.verificarRolAdmin, auth.verificarToken],
    eliminarEspecialidad
  );

  router.get('/especialidad/:id', [auth.verificarToken], buscarEspecialidad);

  /*
   *
   * Division
   *
   */

  //Agregar division
  router.post(
    '/division',
    [auth.verificarToken, auth.verificarRolAdmin],
    agregarDivision
  );

  // listar Divisiones
  router.get('/list-division', auth.verificarToken, listDivision);

  // Modificar Divisiones
  router.put(
    '/division/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    modificarDivision
  );
  // Eliminar Division
  router.delete(
    '/division/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    eliminarDivision
  );
  router.get('/division/:id', [auth.verificarToken], buscarDivision);

  /*
   *
   * Categoria
   *
   */

  //Agregar categoria
  router.post(
    '/categorias',
    [auth.verificarToken, validateCategorias],
    agregarCategoria
  );

  // listar categoria
  router.get('/list-categoria', auth.verificarToken, listCategoria);

  // Modificar categoria
  router.put(
    '/categoria/:id',
    [auth.verificarToken, auth.verificarRolAdmin, validateCategorias],
    modificarCategoria
  );
  // Eliminar categoria
  router.delete(
    '/categoria/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    eliminarCategoria
  );

  router.post('/busco', auth.verificarToken, buscarExistencia);
  router.get('/categoria/:id', [auth.verificarToken], buscoCategoria);
  router.post('/searchcategory', [auth.verificarToken], searchCategory);

  /*
   *
   * Club
   *
   */

  //Agregar club
  router.post(
    '/club',
    // [auth.verificarToken, auth.verificarRolAdmin],
    agregarClub
  );

  // listar club
  router.get('/list-club', auth.verificarToken, listClub);

  // Modificar club
  router.put(
    '/club/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    modificarClub
  );
  // Eliminar club
  router.delete(
    '/club/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    eliminarClub
  );

  router.get('/club/:id', [auth.verificarToken], buscarClub);

  /*
   *
   * Patinadores
   *
   */

  // Agregar Patinadores
  router.post('/patinadores', agregarPatinador);
  // listar participantes
  router.get('/list-patinadores', auth.verificarToken, listParticipantes);

  // modificar Participante
  router.put(
    '/modificar-participante/:id',
    [auth.verificarToken, validateParticipante],
    modificarParticipante
  );

  // Eliminar participante
  router.delete(
    '/eliminar-participante/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    eliminarParticipante
  );

  // Busco Patinador
  router.post('/find-patinador', [auth.verificarToken], buscarPatinador);
  router.get('/cantPatinadores', cantParticipantes);
  router.post('/buscoPatinador', buscoFiltroPatinador);
  router.post('/buscoPatinador2', buscoFiltroPatinador2);
  router.post('/buscoParticipante', findPatinadorSingup);
  router.post('/patinadorDatos', buscarPatinadorCompleto);

  /*
   *
   * Profesor
   *
   */

  router.post('/profesor', agregarProfe);
  router.get('/profesor', auth.verificarToken, listProfesor);
  router.put('/profesor/:id', auth.verificarToken, modificarProfesor);
  router.delete(
    '/profesor/:id',
    [auth.verificarToken, auth.verificarRolAdmin],
    eliminarProfe
  );
  router.post('/find-profesor', auth.verificarToken, buscarProfesor);
  router.get('/cantidadProfesor', totalProfesores);
  router.post('/buscoProfe', buscoFilter);
  router.post('/findProfeLogin', findProfesorSingup);

  /*
   *
   * Relaciones
   *
   */

  router.post(
    '/commonProfe-part',
    // auth.verificarToken,
    participantesProfeEqlClub
  );
  router.get(
    '/commonClub-Profe',
    auth.verificarToken,
    clubProfesoresParticipantes
  );

  /*
   *
   * Envio de correo
   *
   */

  router.post('/enviar', envioEmail);
  router.post('/valido', validoCodigo);
  router.post('/consulta', correoConsulta);

  /*
   *
   * nuevo torneo
   *
   */

  router.post('/nuevoTorneo', auth.verificarRolAdmin, agregarTorneo);
  router.get('/torneo', findTorneo);
  router.post('/participanteTorneo', useTorneo, participanteTorneo); //
  router.post('/modTorneo', auth.verificarRolAdmin, modificarTorneo);
  router.post('/eliminarParticipanteTorneo', eliminarParticipanteTorneo);
  router.delete(
    '/eliminarTorneo/:idTorneo',
    auth.verificarRolAdmin,
    eliminarTorneo
  );
  router.post('/patinadorInscripto', patinadorInscripto);
  router.post('/patinadoresInscripto', patinadoresInscriptos);
  router.post('/cuposTorneo', validarDisponibilidad);
  router.get('/buscoTorneo/:id', buscarTorneo);

  //PLANIFICACION
  router.post('/planificacion', planificacionTorneo);
  router.post('/torneo2', findTorneo2);

  return router;
};
