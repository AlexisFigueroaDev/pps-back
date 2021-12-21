const profesores = require('./../models/Profesioanales');
const patinadores = require('./../models/Patinadores');
const clubes = require('./../models/Club');

const participantesProfeEqlClub = async (req, res, next) => {
  id_profe = req.body.id;
  try {
    const profe = await profesores
      .findById({ _id: id_profe })
      .populate('club')
      .exec((error, data) => {
        let idClub = data.club._id;
        const patinador = patinadores
          .find({ club: idClub })
          .populate({
            path: 'club',
          })
          .populate('Especialidad')
          .populate('Division')
          .populate('Categoria')
          .populate('MontoPatinador.torneo')
          .exec((error, data) => {
            res.json(data);
          });
      });
  } catch (error) {
    res.json({
      error,
      message: 'No se puede mostrar los participantes del profesor',
    });
  }
};

const clubProfesoresParticipantes = async (req, res, next) => {
  id_club = req.body.id;
  try {
    const club = await clubes.findById({ _id: id_club }).exec((error, data) => {
      const profes = profesores
        .find({ club: id_club })
        .populate({
          path: 'club',
        })
        .exec((err, data) => {
          res.json(data);
        });
    });
  } catch (error) {
    res.json({
      error,
      message: 'No se puede mostrar los profesores del club',
    });
  }
};

module.exports = {
  participantesProfeEqlClub,
  clubProfesoresParticipantes,
};
