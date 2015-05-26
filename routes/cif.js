module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();
  var ObjectId  = require("mongolian").ObjectId;

  router.get('/itens/:cif', function(req, res) {
    var cif = req.params['cif'];
    var db = req.db2;
    var itens = db.collection('items');

    itens.aggregate([
      { $match: { cif : cif } },
      { $project: { _id : 0, cif: "$cif", description : "$description", items : "$items" } }
    ]).sort({ 'cif:' : 1}).toArray(function(err, result) {
      if (err) {
        console.log(err);
        res.send("Erro ao tentar ler dados do CIF");
      } else if (result.length == 1) {
        console.log(result[0]);
        res.send(result[0]);
      } else {
        console.log("erro!");
        // Nada encontrado.
        res.send([]);
      }
    });

  });

  router.get('/:id', function(req, res) {
    var id = req.params['id'];
    var db = req.db;
    var pacientes = db.collection('pacientes');

    // pacientes.findOne({ _id: id }, {}, function(err, docs) {
    pacientes.findOne({ _id: new ObjectId(id) }, function(err, docs) {
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
