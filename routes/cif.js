module.exports = function(app, db, passport) {
  var express  = require('express');
  var router   = express.Router();
  var ObjectId = require('mongodb').ObjectId;

  router.get('/itens/:cif', function(req, res) {
    var CIF_Model = require('../models/cif.model')(req, res);
    var cif = req.params.cif;
    CIF_Model.sendAsJSON(cif);
  });

  var loadCIF = function(collection, cif, func) {
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
        console.log("loadCIF(", cif, ") retornou OK.");
        //console.log("Resultado encontrado para ", cif, ':', result[0]);
        func(result[0]);
      } else {
        console.log("erro: nenhum dado encontrado para", cif);
        func(undefined);
      }
    });
  };

  var renderCIF = function(req, res, id, chapter, titles, subset, result, i, len) {
    console.log("renderCIF() called: ", id);
    subset[i] = result;

    if (len == 1) {
      sendPatientData(req, res, id, function(data) {
        console.log("renderCIF() called with id: " + id);
        res.render('cif/capitulo', {
          _id     : id,
          chapter : chapter,
          titles  : JSON.stringify(titles),
          page    : JSON.stringify(subset),
          data    : JSON.stringify(data),
        });
      });
    }

    return len - 1;
  };

  var sendCIF = function(req, res, id, subset, result, i, len) {
    console.log("sendCIF() called with len = ", len);
    subset[i] = result;

    if (len == 1) {
      sendPatientData(req, res, id, function(data) {
        console.log("sendCIF().function() called.");
        res.send({
          page    : JSON.stringify(subset),
          data    : JSON.stringify(data),
        });
      });
    }

    return len - 1;
  };

  var processChapterData = function(chapter, func) {
    console.log('processsChapterData() called.');
    var screens = db.collection('telas');

    result = screens.aggregate([
      { $match : { capitulo : chapter } },
      { $project : { conteudo: "$conteudo" } }
    ]).toArray(function(err, result) {
      if (err) {
        console.log("erro no BD:", err);
      } else if (result.length == 1) {
        //console.log("Resultado encontrado para processChapterData: ", result[0]);
        func(result[0]);
      } else {
        console.log("erro: nenhum dado encontrado para", cif);
      }
    });
  };

  router.post('/capitulo/:chapter/pagina/:page', app.isLoggedIn, function(req, res) {
    var chapter = req.params.chapter;
    var page = req.params.page - 1;
    var id = req.body.id;
    var items = db.collection('itens');

    processChapterData(chapter, function(subdomain) {
      var length = subdomain['conteudo'][page]['nos'].length;
      var subset = Array(length);

      subdomain['conteudo'][page]['nos'].forEach(function(cif, i) {
        loadCIF(items, cif, function(result) { length = sendCIF(req, res, id, subset, result, i, length); } );
      });
    });

  });

  router.get('/capitulo/:chapter', app.isLoggedIn, function(req, res) {
    res.redirect("/paciente/lista/");
  });

  router.post('/capitulo/:chapter', app.isLoggedIn, function(req, res) {
    console.log("/cif/capitulo/:chapter called.");
    var chapter = req.params.chapter;
    var id = req.body.id;
    var itens = db.collection('itens');

    processChapterData(chapter, function(data) {
      //console.log("data = ", data);
      var subdomain = data['conteudo'][0]['nos'];
      var subset = Array(subdomain.length);
      var length = subdomain.length;
      var titles = [];

      for (var content in data['conteudo']) {
        //console.log("content = ", data['conteudo'][content]);
        titles.push(data['conteudo'][content]['titulo']);
      }

      subdomain.forEach(function(cif, i) {
        loadCIF(itens, cif, function(result) { length = renderCIF(req, res, id, chapter, titles, subset, result, i, length); } );
      });

    });

  });

  router.get('/:id', function(req, res) {
    var id = req.params.id;
    var pacientes = db.collection('pacientes');

    // pacientes.findOne({ _id: id }, {}, function(err, docs) {
    pacientes.findOne({ _id: new ObjectId(id) }, function(err, docs) {
      if (err) {
        res.send("Erro ao tentar editar um sujeito");
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

  // Propaga valor da CIF para níveis mais baixos.
  var processCIFDownwards = function(db, patient, cif, value, res) {

    // 1# nível?
    switch (cif.length) {
      case 4: // 1o nível
        return;
      case 5: // 2o nível
        var term = cif.substr(0, 3);
        processCIFBranch(db, term, cif, bla(db, result));
      case 6: // 3o nível
        var term = cif.substr(0, 3);
        processCIFBranch(db, term, cif, function (result) {

        });
    }
  };

  // Salva alteração da CIF no banco de dados.
  router.post('/save/:cif/:position/:value', app.isLoggedIn, function(req, res) {
    console.log("save called.");
    var Dados_Model = require('../models/dados.model')(req, res);
    var CIF_Model = require('../models/cif.model')(req, res);
    var patient = req.body.id;
    var cif = req.params.cif;
    var value = req.params.value;
    var pos = req.params.position - 1;
    var data = db.collection('dados');

    // Obtem valor antigo do dado do sujeito.
    Dados_Model.readDataAndCall(patient, cif, undefined, function(patient, cif, values, error) {
      if (!error) {
        // Atualiza um item em cascata.
        values[pos] = isNaN(value) ? value : parseFloat(value);
        console.log('values = ' + values);

        Dados_Model.cascadeUpdate(patient, cif, values, function(patient, cif, values, error) {
          if (!error) {
            // Processa nós de nível mais baixo.
            CIF_Model.processCIFDownwards(patient, cif, pos, function(error) {
              console.log(error ? "save() failed: " + error.message : "save() successful.");

              if (!error) {
                // Devolve os dados afetados pela alteração para o cliente.
                Dados_Model.readBranchData(patient, cif, function(patient, cif, result, error) {
                  if (!error) {
                    console.log("Result :", result);
                    res.send({r: 'OK', d: result});
                  } else {
                    console.log("save() failed: ", error.message);
                    res.send({r: 'ERROR'});
                  }
                });
              } else {
                console.log("save() failed: ", error.message);
                res.send({r: 'ERROR'});
              }
            });
          } else {
            console.log("save() failed: ", error.message);
            res.send({r: 'ERROR'});
          }
        });
      } else {
        console.log("save() failed: ", error.message);
        res.send({r: 'ERROR'});
      }
    })

  });

  // Carrega e envia dados preenchidos do sujeito.
  sendPatientData = function(req, res, patient, func) {
    console.log("sendPatientData() called.");
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
