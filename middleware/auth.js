const usuario = require('./../models/Usuarios');
const jwt = require('jsonwebtoken');

// const verificoToken = (req, res, next) => {
//   let token = req.get('token');

//   jwt.verify(token, 'PPSUTN', (err, decoded) => {

//     if (err) {
//       return res.status(401).json({
//         ok: false,
//         err: {
//           message: 'Token no valido',
//         },
//       });
//     }
//     //------------ANOTACION------------//
//     /*
//      * EL DECODE ES EL PAYLOAD
//      */
//     req.usuario = decoded;

//     next();
//   });
// };

const verificarToken = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, 'PPSUTN', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no valido',
        },
      });
    }
    //------------ANOTACION------------//
    /*
     * EL DECODE ES EL PAYLOAD
     */
    req.usuario = decoded;

    next();
  });
};

const verificarRolAdmin = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, 'PPSUTN', (err, payload) => {
    if (payload.role === 'ADMIN') {
      next();
    } else {
      return res.json({
        ok: false,
        err: {
          message: 'El usaurio no es ADMIN',
        },
      });
    }
  });
};

let verificarRolProfesor = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, 'PPSUTN', (err, payload) => {
    if (payload.role === 'PROFESOR') {
      next();
    } else {
      return res.json({
        ok: false,
        err: {
          message: 'El usaurio no es PROFESOR',
        },
      });
    }
  });
};

let verificarRolParticipante = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, 'PPSUTN', (err, payload) => {
    if (payload.role === 'PARTICIPANTE') {
      next();
    } else {
      return res.json({
        ok: false,
        err: {
          message: 'El usaurio no es PARTICIPANTE',
        },
      });
    }
  });
};

const whoami = (req, res, next) => {
  let token = req.get('token');
  jwt.verify(token, 'PPSUTN', (err, payload) => {
    return res.json({ role: payload.role });
  });
};

const datosUser = (req, res, next) => {
  let token = req.get('token');
  jwt.verify(token, 'PPSUTN', (err, payload) => {
    return res.json(payload);
  });
};
module.exports = {
  verificarToken,
  verificarRolAdmin,
  verificarRolParticipante,
  verificarRolProfesor,
  whoami,
  datosUser,
};
