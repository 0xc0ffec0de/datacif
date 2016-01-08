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
    //console.log("renderCIF(%s, %i)", );
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
    //console.log("sendCIF(%s, %i)", );
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

    subdomain.forEach(function(cif, i) {
      loadCIF(itens, cif, function(result) { length = sendCIF(req, res, id, subset, result, i, length); } );
    });
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

    subdomain.forEach(function(cif, i) {
      loadCIF(itens, cif, function(result) { length = renderCIF(req, res, id, chapter, titles, subset, result, i, length); } );
    });
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

  // Varre estrutura de dados da CIF procurando códigos da CIF.
  var collectCIF = function(list, node) {
    if (node && node.cif) {
      list.push(node.cif);

      if (node.items) {
        for (index in node.items) {
          console.log("collectCIF(%s)", node.items[index]);
          list = collectCIF(list, node.items[index]);
        }
      }
    }

    return list;
  }

  // Propaga valor da CIF para níveis mais altos.
  var cascadeUpdate = function(db, cif, value, res) {
    var items = db.collection('itens');
    var data = db.collection('dados');
    console.log("cascadeUpdate called.", cif);

    //items.find({ cif : cif }).toArray(function(err, result) {
    items.aggregate([
      { $match: { cif : cif } },
      { $project: { cif : "$cif", items : "$items" } }
    ]).toArray(function(err, result) {
      console.log("aggregate returned ", result[0]);

      if (err) {
        res.send("Erro ao tentar encontrar CIF");
        return false;
      } else if (result[0] && result[0].items) {
        var list = [];
        list = collectCIF(list, result[0]);
        console.log("list = ", list);

        // Atualiza todos os itens daquele ramo.
        for (index in list) {
          data.findAndModify(
            { c: list[index] }, // query
            [[ 'c', 1 ]], // sort
            { $set: { v: value } }, // replacement
            { upsert: true }, // options
            function(err, docs) {
              if (err) {
                console.log(err.message);
                res.send({ r: 'ERR' });
              } else {
                res.send({ r: 'OK' });
              }
            }
          );
        }

      }
    });
  };

  // Salva alteração da CIF no banco de dados.
  router.post('/save/:cif/:position/:value', function(req, res) {
    console.log("save called with", req.body);
    var cif = req.params.cif;
    var value = req.params.value;
    var db = req.db2;

    cascadeUpdate(db, cif, value, res);
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
