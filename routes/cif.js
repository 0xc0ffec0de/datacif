module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();

  router.get('/items/:cif', function(req, res) {
    var cif = req.params['cif'];
    var db = req.db;
    var items = db.collection('items');

    items.findOne({ cif: cif }, {}, function(err, docs) {
      if (err) {
        res.send("Erro ao tentar ler dados de CIF");
      } else if (docs) {
        res.send(docs);
      }
    });
  });

  router.get('/:id', function(req, res) {
    var id = req.params['id'];
    var db = req.db;
    var pacientes = db.collection('pacientes');

    pacientes.findOne({ _id: id }, {}, function(err, docs) {
      if (err) {
        res.send("Erro ao tentar editar um paciente");
      } else if (docs) {
        var queryResult = {
          title : docs.nome,
          nome : docs.nome,
          _id : docs._id,
          dataNascimento : docs.dataNascimento,
          sexo : docs.sexo == 'm' ? true : false,
        };

        res.render('cif', queryResult);
      }
    });
  });

  router.post('/save', function(req, res) {
    var id = req.params['cif'];
    var db = req.db;
    var data = db.collection('dados');
    var pacient = req.body['p[]'];
    var cif = req.body['c'];
    var value = req.body['v[]'];

    data.findAndModify(
      { p: pacient, c: cif }, // query
      { $set: { v: value } }, // replacement
      { upsert: true }, // options
      function(err, docs) {
        if (err) {
          console.log(err.message);
        } else {
          res.send({ r: 'OK' });
        }
      }
    );
  });

  return router;
}
