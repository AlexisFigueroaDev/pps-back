const Usuarios = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { logger } = require('../tools/logger');

const client = new OAuth2Client(
  '442156155935-lgnqko0gs0decuav5sol7uld33gmenuk.apps.googleusercontent.com'
);

exports.registrarUsuario = async (req, res) => {
  // leer los datos del usuario y colocarlos en Usuarios
  const usuario = new Usuarios(req.body);
  usuario.password = await bcrypt.hash(req.body.password, 12);
  try {
    await usuario.save();
    logger.info({ usuario, mensaje: 'Usuario Creado Correctamente' });
    res.status(201).json({ mensaje: 'Usuario Creado Correctamente', usuario });
  } catch (error) {
    logger.info({ error, mensaje: 'Hubo un error' });

    res.json({ error, mensaje: 'Hubo un error' });
  }
};

exports.autenticarUsuario = async (req, res, next) => {
  // buscar el usuario
  const { email, password } = req.body;
  const usuario = await Usuarios.findOne({ email });

  if (!usuario) {
    // Si el usuario no existe
    await res.status(406).json({ mensaje: 'Ese usuario no existe' });
    next();
  } else {
    // El usuario existe, verificar si el password es correcto o incorrecto
    if (!bcrypt.compareSync(password, usuario.password)) {
      // si el password es incorrecto
      logger.debug({
        message: 'Password Incorrecto',
        output: `result: ${password}`,
      });

      await res.status(401).json({ mensaje: 'Password Incorrecto' });
      next();
    } else {
      // password correcto, firmar el token
      const token = jwt.sign(
        {
          email: usuario.email,
          nombre: usuario.nombre,
          id: usuario._id,
          role: usuario.role,
        },
        'PPSUTN',
        {
          expiresIn: '24h',
        }
      );

      // retornar el TOKEN
      logger.debug({
        message: 'Se inicio sesion',
        token,
        usuario,
      });
      res.json({ token, usuario });
    }
  }
};

//Configuraciones de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:
      '442156155935-lgnqko0gs0decuav5sol7uld33gmenuk.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
    email_verified: payload.email_verified,
  };
}

exports.autenticarUsuarioGoogle = async (req, res, next) => {
  let token = req.body.token;

  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  Usuarios.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe de usar su autenticacion normal o no existe',
          },
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          'PPSUTN',
          { expiresIn: '24h' }
        );

        return res.json({
          ok: true,
          usuarioDB: usuarioDB,
          token,
        });
      }
    }
    // else {
    //   //Si el usuario no existe en nuestra base de datos
    //   let usuario = new Usuarios();

    //   usuario.nombre = googleUser.nombre;
    //   usuario.email = googleUser.email;
    //   usuario.img = googleUser.img;
    //   usuario.google = true;
    //   usuario.password = ':)';

    //   usuario.save((err, usuarioDB) => {
    //     if (err) {
    //       return res.status(500).json({
    //         ok: false,
    //         err,
    //       });
    //     }

    //     let token = jwt.sign(
    //       {
    //         usuario: usuarioDB,
    //       },
    //       process.env.SEED,
    //       { expiresIn: process.env.CADUCIDAD_TOKEN }
    //     );

    //     return res.json({
    //       ok: true,
    //       usuarioDB: usuarioDB,
    //       token,
    //     });
    //   });
    // }
  });
};

exports.usuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuarios.find({});
    res.json(usuarios);
  } catch (err) {
    res.json(err);
    next();
  }
};

exports.getUsuarios = async (req, res, next) => {
  const options = {
    page: req.params.id,
    limit: 8,
  };

  Usuarios.paginate({}, options, (err, data) => {
    res.json({
      data,
    });
  });
};

exports.eliminarUsuario = async (req, res, next) => {
  try {
    await Usuarios.findByIdAndDelete({ _id: req.params.id });
    res.json({
      ok: true,
      message: 'el usuario se elimino correctamente',
    });
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error',
    });
  }
};

exports.buscarUsuario = async (req, res, next) => {
  try {
    id = req.params.id;

    const usuario = await Usuarios.findById(id);
    res.json(usuario);
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error',
    });
  }
};

exports.modificarUsuario = async (req, res, next) => {
  try {
    const update = {
      nombre: req.body.nombre,
      email: req.body.email,
      role: req.body.role,
    };

    if (update.role == undefined) {
      update.role = 'ADMIN';
    }

    let usuario = await Usuarios.findOneAndUpdate(
      { _id: req.params.id },
      update,
      {
        new: true,
      }
    );

    res.json({
      usuario,
    });
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error',
      error: error.code,
    });
  }
};

exports.cambiarPassword = async (req, res, next) => {
  try {
    let update = {
      password: req.body.password,
    };

    update.password = await bcrypt.hash(req.body.password, 12);

    let usuario = await Usuarios.findOneAndUpdate(
      { email: req.body.email },
      update,
      {
        new: true,
      }
    );

    res.json({
      Message: 'Se actualizo la contraseña de forma correcta',
    });
  } catch (error) {
    res.json({
      ok: false,
      message: 'Hubo un error',
      error: error.code,
    });
  }
};
