module.exports = function(app, passport) {
  var express   = require('express');
  var router    = express.Router();
  var ObjectId  = require("mongolian").ObjectId;
  var mappings  = require('./mappings');

  router.get('/itens/:cif', function(req, res) {
    var cif = req.params.cif;
    var db = req.db2;
    var itens = db.collection('itens');

    itens.aggregate([
      { $match: { cif : cif } },
      { $project: { _id : 0, cif: "$cif", description : "$description", items : "$items" } },
      { $sort: { cif : 1 } }
    ]).toArray(function(err, result) {
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

  loadCIF = function(collection, cif, func) {
    console.log("loadCIF(%s)", cif);

    collection.aggregate([
      { $match : { cif : cif } },
      { $project : { _id : 0, cif: "$cif", description : "$description", items : "$items" } },
      { $sort : { cif : 1 }}
    ], function(err, result) {
      if (err) {
        console.log("erro no BD:", err);
        func(undefined);
      } else if (result.length == 1) {
        console.log("Resultado encontrado para", cif, ':', result[0]);
        func(result[0]);
      } else {
        console.log("erro: nenhum dado encontrado para", cif);
        func(undefined);
      }
    });
  };

  renderCIF = function(req, res, id, chapter, titles, subset, result, i, len) {
    subset[i] = result;

    if (len == 1) {
      sendPatientData(req, res, id, function(data) {
        console.log("data:", data);
        res.render("capitulo", {
          id      : id,
          chapter : chapter,
          titles  : JSON.stringify(titles),
          page    : JSON.stringify(subset),
          data    : JSON.stringify(data),
        });
      });
    }

    return len - 1;
  };

  sendCIF = function(req, res, id, subset, result, i, len) {
    subset[i] = result;

    if (len == 1) {
      sendPatientData(req, res, id, function(data) {
        res.send({
          page    : JSON.stringify(subset),
          data    : JSON.stringify(data),
        });
      });
    }

    return len - 1;
  };

  router.post('/capitulo/:chapter/pagina/:page', app.isLoggedIn, function(req, res) {
    var chapter = req.params.chapter;
    var page = req.params.page - 1;
    var id = req.body.id;
    var db = req.db2;
    var itens = db.collection('itens');
    var subdomain = mappings.page2cif(chapter, page);
    var subset = Array(subdomain.length);
    var length = subdomain.length;
    var func = function(result) {
      length = sendCIF(req, res, id, subset, result, i, length);
    };

    for (var i in subdomain) {
      cif = subdomain[i];
      loadCIF(itens, cif, func); // function(result) { count = sendCIF(req, res, id, subset, result, i, count); } );
    }
  });

  router.get('/capitulo/:chapter', app.isLoggedIn, function(req, res) {
    res.redirect("/paciente/lista/");
  });

  router.post('/capitulo/:chapter', app.isLoggedIn, function(req, res) {
    var chapter = req.params.chapter;
    var id = req.body.id;
    var db = req.db2;
    var itens = db.collection('itens');
    var data = mappings.chapter2cif(chapter);
    var titles = data.titles;
    var subdomain = data.first;
    var subset = Array(subdomain.length);
    var length = subdomain.length;
    var func = function(result) {
      length = sendCIF(req, res, id, subset, result, i, length);
    };

    for (var i in subdomain) {
      cif = subdomain[i];
      loadCIF(itens, cif, func); // function(result) { count = renderCIF(req, res, id, chapter, titles, subset, result, i, count); } );
    }
  });

  router.get('/:id', function(req, res) {
    var id = req.params.id;
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

  router.post('/save/:cif/:position/:value', function(req, res) {
    console.log("save called with", req.body);
    var cif = req.params.cif;
    var pos = req.params.position - 1;
    var value = req.params.value;
    var id = req.body.id;
    var db = req.db2;
    var data = db.collection('dados');
    console.log("id =", id, "cif =", cif, "value =", value);

    data.aggregate([
      { $match: { p : id, c : cif } },
      { $project: { _id : "$_id", p : "$p", c: "$c", v : "$v" } }
    ]).sort({ 'c:' : 1 }).toArray(function(err, result) {
      console.log("Result = ", result);
      if (err) {
        console.log(err);
        res.send({ r: 'ERR1' });
      } else {
        console.log(result.length, "resultados encontrados:", result);
        if (result) {
          result = result[0];
          if (result === null) {
            result = { v: [] };
          } else if (result.v === null) {
            result.v = [];
          }
        } else {
          result = { v: [] };
        }
        result.v[pos] = value;

        data.findAndModify(
          { p: id, c: cif }, // query
          [[ 'c', 1 ]], // sort
          { $set: { v: result.v } }, // replacement
          { upsert: true }, // options
          function(err, docs) {
            if (err) {
              console.log(err.message);
              res.send({ r: 'ERR2' });
            } else {
              res.send({ r: 'OK' });
            }
          }
        );

      }
    });

  });

  // Carrega e envia dados do paciente.
  sendPatientData = function(req, res, patient, func) {
    console.log("load called.");
    var db = req.db2;
    var data = db.collection('dados');

    data.aggregate([
      { $match: { p : patient } },
      { $project: { _id : 0, p : "$p", c: "$c", v : "$v" } }
    ]).sort({ 'c:' : 1 }).toArray(function(err, result) {
      if (err) {
        console.log(err);
        func([]);
      } else {
        console.log(result.length, "resultados encontrados:", result);
        func(result);
      }
    });
  };

  return router;
};
