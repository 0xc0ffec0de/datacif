module.exports = function(app, passport) {
  var express   = require('express');
  var router    = express.Router();
  var ObjectId  = require("mongolian").ObjectId;
  var wait      = require('wait.for');

  router.get('/itens/:cif', function(req, res) {
    var cif = req.params['cif'];
    var db = req.db2;
    var itens = db.collection('itens');

    itens.aggregate([
      { $match: { cif : cif } },
      { $project: { _id : 0, cif: "$cif", description : "$description", items : "$items" } }
    ]).sort({ 'cif:' : 1 }).toArray(function(err, result) {
      if (err) {
        console.log(err);
        res.send("Erro ao tentar ler dados do CIF");
      } else if (result.length == 1) {
        console.log("1 resultado encontrado");
        res.send(result[0]);
      } else {
        // Nada encontrado.
        console.log("erro: nenhum dado encontrado.");
        res.send([]);
      }
    });
  });

  router.post('/capitulo/:chapter', app.isLoggedIn, function(req, res) {
    var chapterName = req.params['chapter'];
    var id = req.body.id;
    var db = req.db2;
    var itens = db.collection('itens');
    var chapter = chapter2cif(chapterName);

    append = function(set, subset, result, len1, len2) {
      // console.log("result =", result);
      subset.push(result);
      if (subset.length == len1) {
        // console.log("subset =", subset);
        set.push(subset);

        if (set.length == len2) {
          console.log("set =", JSON.stringify(set));
          res.render("capitulo", { id: id, chapter : JSON.stringify(set) });
        }
      }
    };

    var set = [];
    chapter.forEach(function(subdomain) {
      var subset = [];
      subdomain.forEach(function(cif) {
        loadCIF(itens, cif, function(result) { append(set, subset, result, subdomain.length, chapter.length); } );
      });
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

  router.post('/save/:cif/:value', function(req, res) {
    console.log("save called with", req.body);
    var cif = req.params['cif'];
    var value = req.params['value'];
    var id = req.body.id;
    var db = req.db2;
    var data = db.collection('dados');
    console.log("id =", id, "cif =", cif, "value =", value);

    data.findAndModify(
      { p: id, c: cif }, // query
      [[ 'c', 1]], // sort
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

  chapter2cif = function(chapter) {
    switch (chapter) {
      case 'b1':
        return [
          [ "b110", "b114", "b126", "b130", "b134" ],
          [ "b140", "b144", "b152", "b156", "b160", "b164", "b167", "b172" ]
        ];

      case 'b2':
        return [];

      case 'b3':
        return [];

      case 'b4':
        return []

      case 'b5':
        return [];

      case 'b6':
        return [];

      case 'b7':
        return [];

      case 'b8':
        return [];
    }
  };

  loadCIF = function(collection, cif, func) {
    console.log("loadCIF(%s)", cif);

    collection.aggregate([
      { $match: { cif : cif } },
      { $project: { _id : 0, cif: "$cif", description : "$description", items : "$items" } }
    ], function(err, result) {
      if (err) {
        console.log("erro no BD:", err);
        func(undefined);
      } else if (result.length == 1) {
        // console.log("Resultado encontrado para", cif);
        func(result[0]);
      } else {
        console.log("erro: nenhum dado encontrado.");
        func(undefined);
      }
    })
  };

  return router;
}
