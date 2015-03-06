var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
  var id = req.params['id'];
  var db = req.db;
  var pacientes = db.get('pacientes');

  pacientes.findOne({ _id: id }, {}, function(err, docs) {
    if (err) {
      res.send("Erro ao tentar editar um paciente");
    } else if (docs) {
      var queryResult = {
        title : "Edita CIF do paciente",
        _id : docs._id,
        nome : docs.nome,
        dataNascimento : docs.dataNascimento,
        sexo : docs.sexo == 'm' ? true : false,
      };

      res.render('cif', queryResult);
    }
  });
});

module.exports = router;
