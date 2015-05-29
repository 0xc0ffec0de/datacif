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
        console.log("erro: nenhum dado encontrado para", cif);
        func(undefined);
      }
    })
  };

  renderCIF = function(req, res, id, chapter, titles, subset, result, len) {
    console.log("result =", result);
    subset.push(result);

    if (subset.length == len) {
      sendPatientData(req, res, id, function(data) {
        res.render("capitulo", {
          id      : id,
          chapter : JSON.stringify(chapter),
          titles  : JSON.stringify(titles),
          page    : JSON.stringify(subset),
          data    : JSON.stringify(data),
        });
      });
    }
  };

  sendCIF = function(req, res, id, subset, result, len) {
    // console.log("result =", result);
    subset.push(result);

    if (subset.length == len) {
      sendPatientData(req, res, id, function(data) {
        res.send({
          page    : JSON.stringify(subset),
          data    : JSON.stringify(data),
        });
      });
      // res.send(JSON.stringify(subset));
    }
  };

  router.post('/capitulo/:chapter/pagina/:page', app.isLoggedIn, function(req, res) {
    var chapter = req.params['chapter'];
    var page = req.params['page'];
    var id = req.body.id;
    var db = req.db2;
    var itens = db.collection('itens');
    var subdomain = page2cif(chapter, page);
    var subset = [];

    subdomain.forEach(function(cif) {
      loadCIF(itens, cif, function(result) { sendCIF(req, res, id, subset, result, subdomain.length); } );
    });
  });

  router.post('/capitulo/:chapter', app.isLoggedIn, function(req, res) {
    var chapter = req.params['chapter'];
    var id = req.body.id;
    var db = req.db2;
    var itens = db.collection('itens');
    var data = chapter2cif(chapter);
    var titles = data.titles;
    var subdomain = data.first;
    var subset = [];

    subdomain.forEach(function(cif) {
      loadCIF(itens, cif, function(result) { renderCIF(req, res, id, chapter, titles, subset, result, subdomain.length); } );
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
      [[ 'c', 1 ]], // sort
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

  page2cif = function(chapter, page) {
    page = parseInt(page);

    switch (chapter) {
      case 'b1':
        switch (page) {
          case 0:
            return [ "b110", "b114", "b126", "b130", "b134" ];
          case 1:
            return [ "b140", "b144", "b152", "b156", "b160", "b164", "b167", "b172", "b180" ];
        };
      case 'b2':
        switch (page) {
          case 0:
            return [ "b210", "b215" ];
          case 1:
            return [ "b230", "b235", "b240" ];
          case 2:
            return [ "b250", "b255", "b260", "b265", "b270" ];
          case 3:
            return [ "b280" ];
        };
      case 'b3':
        switch (page) {
          case 0:
            return [ "b310", "b330", "b340" ];
        };
      case 'b4':
        switch (page) {
          case 0:
            return [ "b410", "b415", "b420" ];
          case 1:
            return [ "b430", "b435" ];
          case 2:
            return [ "b440", "b445" ];
          case 3:
            return [ "b450", "b455" ];
        };
      case 'b5':
        switch (page) {
          case 0:
            return [ "b510", "b515", "b525", "b530", "b535" ];
          case 1:
            return [ "b540", "b545", "b550" ];
        };
      case 'b6':
        switch (page) {
          case 0:
            return [ "b610", "b620" ];
          case 1:
            return [ "b640", "b650", "b660", "b670" ];
        };
      case 'b7':
        switch (page) {
          case 0:
            return [ "b710", "b715", "b720" ];
          case 1:
            return [ "b730", "b735", "b740", "b750", "b760", "b765", "b770" ];
        };
      case 'b8':
        switch (page) {
          case 0:
            return []; // FIXME
        }
    }
    return [];
  };

  chapter2cif = function(chapter) {
    var result = {};

    switch (chapter) {
      case 'b1':
        result.titles = [
          "Funções mentais globais",
          "Funções mentais específicas"
        ];
        break;

      case 'b2':
        result.titles = [
          "Visão e funções relacionadas",
          "Funções auditivas e vestibulares",
          "Funções sensoriais adicionais",
          "Dor"
        ];
        break;

      case 'b3':
        result.titles = [
          "Funções da voz e da fala"
        ];
        break;

      case 'b4':
        result.titles = [
          "Funções do Aparelho Cardiovascular, dos Sistemas Hematológico e Imunológico e do Aparelho Respiratório",
          "Funções do Sistema Hematológico e Imunológico",
          "Funções do Aparelho Respiratório",
          "Funções e Sensações Adicionais dos Aparelhos Cardiovascular e Respiratório"
        ];
        break;

      case 'b5':
        result.tiles = [
          "Funções Relacionadas com o Aparelho Digestivo",
          "Funções Relacionadas com os Sistemas Metabólicos e Endócrinos"
        ];
        break;

      case 'b6':
        result.titles = [
          "Funções Urinárias",
          "Funções Sexuais e Reprodutivas"
        ];
        break;

      case 'b7':
        result.titles = [
          "Funções das Articulações e dos Ossos",
          "Funções Musculares"
        ];
        break;

      case 'b8':
        result.titles = [
          "Funções da Pele e Estruturas Relacionadas"
        ];
        break;
    }

    result.first = page2cif(chapter, 0);
    return result;
  };

  return router;
}
