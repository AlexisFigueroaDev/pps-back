const nodemailer = require('nodemailer');
const configMail = require('./ConfigMail');
const CODES = require('./../models/ValidacionCode');

const codigo = () => {
  let codigo = Math.floor(100000 + Math.random() * 900000);
  return codigo;
};

let code = codigo();

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;1,100&display=swap"
      rel="stylesheet"
    />

    <style>
      h2,
      h4 {
        font-family: 'Roboto', sans-serif;
      }

      .grid-master {
        display: grid;
        grid-template-columns: repeat(18, 50px);
        grid-template-rows: repeat(5, 50px);
      }

      .grid-titulo {
        grid-column: 1/15;
        grid-row: 1;
      }

      .grid-cuerpo {
        grid-column: 1/15;
        grid-row: 3;
      }

      .grid-codigo {
        grid-row: 4;
        grid-column: 1/13;
      }
    </style>
  </head>
  <body>
    <div class="grid-master">
      <div class="grid-titulo">
        <h2>Codigo de Verificacion</h2>
      </div>
      <div class="grid-cuerpo">
        <h4>tu codigo de verificacion es:</h4>
      </div>
      <h2 class="grid-codigo">${code}</h2>
      
    </div>
  </body>
</html>
`;

const html2 = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;1,100&display=swap"
      rel="stylesheet"
    />

    <style>
      h2,
      h4 {
        font-family: 'Roboto', sans-serif;
      }

      .grid-master {
        display: grid;
        grid-template-columns: repeat(18, 50px);
        grid-template-rows: repeat(5, 50px);
      }

      .grid-titulo {
        grid-column: 1/15;
        grid-row: 1;
      }

      .grid-cuerpo {
        grid-column: 1/15;
        grid-row: 3;
      }

      .grid-codigo {
        grid-row: 4;
        grid-column: 1/13;
      }
    </style>
  </head>
  <body>
    <div class="grid-master">
      <div class="grid-titulo">
        <h2>Codigo de Verificacion</h2>
      </div>
      <div class="grid-cuerpo">
        <h4>tu codigo de verificacion es:</h4>
      </div>
      <h2 class="grid-codigo">${code}</h2>
      
    </div>
  </body>
</html>
`;
const actualizoCodigo = async (id, { email, codigo } = update) => {
  await CODES.findOneAndUpdate({ _id: id }, { email, codigo }, { new: true });
};

const existeEmail = (email, code) => {
  const update = {
    email: email,
    codigo: code,
  };

  const nuevoCodigo = {
    email: email,
    codigo: code,
  };

  try {
    let id;
    CODES.find({ email: email }).exec((err, data) => {
      if (data.length > 0) {
        id = data[0]._id;
        actualizoCodigo(id, update);
      } else {
        const codigos = new CODES(nuevoCodigo);
        try {
          codigos.save();
        } catch (error) {}
      }
    });
  } catch (error) {}
};

const envioEmail = async (req, res, next) => {
  try {
    email = req.body.email;
    //email = 'figueroagabrielalexis@correo.com';

    nuevoCodigo = {
      email: email,
      codigo: code,
    };

    await existeEmail(email, code);

    let transport = await nodemailer.createTransport({
      host: configMail.transport.host,
      port: configMail.transport.port,
      auth: {
        user: configMail.transport.auth.user,
        pass: configMail.transport.auth.pass,
      },
    });

    let info = await transport.sendMail({
      from: '"La DOCTA" <c15922de23-fc7938@inbox.mailtrap.io>', // sender address
      to: email, // list of receivers
      subject: 'Codigo de verificacion', // Subject line
      html: html, // html body
    });

    res.json({
      message: 'Revisa tu correo electronico',
      code,
    });
  } catch (error) {
    res.status(200).json({
      error,
      message: 'Hubo un error al enviar el correo electronico',
    });
    next();
  }
};

// consulto si el correo tiene el codigo de verificacion
const validoCodigo = async (req, res, next) => {
  try {
    email = req.body.email;
    codigoValidacion = req.body.codigo;
    const code = await CODES.find({ email: email }).exec((err, data) => {
      if (data.length > 0) {
        if (data[0].codigo == codigoValidacion) {
          res.json({
            ok: true,
            message: 'El codigo es correcto',
          });
          next();
        } else {
          res.json({
            ok: false,
            message: 'El codigo de verificacion es erroneo',
          });
        }
      } else {
        res.json({
          message: 'Hubo un error con el correo, reintente nuevamente',
        });
      }
    });
  } catch (error) {
    res.json({
      error,
      ok: false,
      message: 'Hubo un error al consultar el codigo de verificacion',
    });
  }
};

const correoConsulta = async (req, res) => {
  try {
    remitente = req.body.email;
    consulta = req.body.consulta;
    //email = 'figueroagabrielalexis@correo.com';

    let transport = await nodemailer.createTransport({
      host: configMail.transport.host,
      port: configMail.transport.port,
      auth: {
        user: configMail.transport.auth.user,
        pass: configMail.transport.auth.pass,
      },
    });

    let info = await transport.sendMail({
      from: remitente, // sender address
      to: 'ladocta.patin@gmail.com', // list of receivers
      subject: `Nueva Consulta de ${remitente}`, // Subject line
      html: `
        <body>
          <div class="grid-master">
            <div class="grid-titulo">
              <h2>Nueva Consulta</h2>
            </div>
            <div class="grid-cuerpo">
              <p>${consulta}</p>
            </div>
            > Usuario:  ${remitente}
          </div>
        </body>
      `, // html body
    });

    res.json({
      message: 'Se envio la consulta de forma correcta',
    });
  } catch (error) {
    res.status(200).json({
      error,
      message: 'Hubo un error al enviar el correo electronico',
    });
  }
};

module.exports = {
  envioEmail,
  validoCodigo,
  correoConsulta,
};
