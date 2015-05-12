module.exports = function(app, passport) {
  var express   = require('express');
  var router    = express.Router();
  var ObjectId  = require("mongolian").ObjectId;

  router.get('/', app.isLoggedIn, function(req, res) {
    res.location("/paciente/lista");
    res.redirect("/paciente/lista");
  });

  router.get('/lista', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var pacientes = db.collection('pacientes');
    pacientes.find().sort({ 'nome' : 1 }).toArray(function(err, item) {

      if (err) {
        res.send("Erro ao tentar listar pacientes");
      }

      res.render('pacientes', {
        title : 'Lista de todos os pacientes',
        pacientes : item
      });
    });
  });

  router.get('/edita/:id', app.isLoggedIn, function(req, res) {
    var id = req.params['id'];
    var db = req.db;
    var pacientes = db.collection('pacientes');

    // pacientes.findOne({ _id: id }, {}, function(err, item) {
    pacientes.findOne({ _id: new ObjectId(id) }, function(err, item) {
      if (err) {
        res.send("Erro ao tentar editar um paciente");
      } else if (item) {
        var queryResult = {
          title           : "Edita paciente",
          _id             : item._id,
          nome            : item.nome,
          dataNascimento  : item.dataNascimento,
          sexo            : item.sexo == 'm' ? true : false,
          peso            : item.peso,
          altura          : item.altura,
          cpf             : item.cpf,
          dependente      : item.dependente,
          logradouro      : item.endereco.logradouro,
          complemento     : item.endereco.complemento,
          bairro          : item.endereco.bairro,
          cep             : item.endereco.cep,
          registros       : item.registros,
          morbidades      : item.morbidades,
          anamnese        : item.anamnese ? item.anamnese : '',
          address         : '/paciente/altera'
        };

        console.log("[edt]paciente = ", queryResult);
        res.render('paciente', queryResult);
      } else {
        res.send({});
      }
    });
  });

  router.get('/novo', app.isLoggedIn, function(req, res) {
    res.render('paciente', {
      title           : 'Adiciona novo paciente',
      _id             : '',
      nome            : '',
      dataNascimento  : '',
      sexo            : true,
      peso            : '',
      altura          : '',
      cpf             : '',
      dependente      : false,
      registros       : '',
      logradouro      : '',
      complemento     : '',
      bairro          : '',
      cep             : '',
      morbidades      : [],
      anamnese        : '',
      address         : '/paciente/adiciona'
    });
  });

  router.get('/adiciona', app.isLoggedIn, function(req, res) {
    res.location("/paciente/lista");
    res.redirect("/paciente/lista");
  });

  router.post('/adiciona', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var values = req.body.registros.slice(1, req.body.registros.length);
    var labels = req.body.tiposRegistro.slice(1, req.body.tiposRegistro.length);
    var registros = [];

    if (values && values.length > 0) {
      values.forEach(function(value, i) {
        registros.push({ nome: labels[i], valor: value });
      });
    }

    var paciente = {
      nome            : req.body.nome,
      dataNascimento  : req.body.dataNascimento,
      sexo            : req.body.sexo,
      peso            : req.body.peso,
      altura          : req.body.altura,
      cpf             : req.body.cpf,
      dependente      : req.body.dependente == 't' ? true : false,
      registros       : registros,
      morbidades      : req.body.morbidades.slice(1, req.body.morbidades.length),
      anamnese        : req.body.anamnese
    };

    var endereco = {
      logradouro  : req.body.logradouro,
      complemento : req.body.complemento,
      bairro      : req.body.bairro,
      cep         : req.body.cep
    };

    paciente.endereco = endereco;
    console.log("[add]paciente = ", paciente);

    var pacientes = db.collection('pacientes');
    pacientes.insert(paciente, function(err, item) {
      if (err) {
        res.send("Erro ao tentar inserir um novo paciente");
      } else {
        var id = item._id.toString();
        res.location("/paciente/menu/" + id);
        res.redirect("/paciente/menu/" + id);
      }
    })
  });

  router.get('/altera', app.isLoggedIn, function(req, res) {
    res.location("/paciente/lista");
    res.redirect("/paciente/lista");
  });

  router.post('/altera', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var id = new ObjectId(req.body._id);

    var values = req.body.registros.slice(1, req.body.registros.length);
    var labels = req.body.tiposRegistro.slice(1, req.body.tiposRegistro.length);
    var registros = [];

    if (values && values.length > 0) {
      values.forEach(function(value, i) {
        registros.push({ nome: labels[i], valor: value });
      });
    }

    var paciente = {
      nome            : req.body.nome,
      dataNascimento  : req.body.dataNascimento,
      sexo            : req.body.sexo,
      peso            : req.body.peso,
      altura          : req.body.altura,
      cpf             : req.body.cpf,
      dependente      : req.body.dependente == 't' ? true : false,
      registros       : registros,
      morbidades      : req.body.morbidades.slice(1, req.body.morbidades.length),
      anamnese        : req.body.anamnese
    };

    var endereco = {
      logradouro  : req.body.logradouro,
      complemento : req.body.complemento,
      bairro      : req.body.bairro,
      cep         : req.body.cep
    };

    paciente.endereco = endereco;
    console.log("[alt]paciente = ", paciente);

    var pacientes = db.collection('pacientes');
    pacientes.update({ _id: id }, paciente,
      function(err, doc) {
        if (err) {
          res.send("Erro ao tentar alterar um paciente");
        } else {
          res.location("/paciente/menu/" + id);
          res.redirect("/paciente/menu/" + id);
        }
      });
  });

  router.get('/menu/:id', app.isLoggedIn, function(req, res) {
    res.render("menu", { id : req.params['id'] });
  });

  router.get('/estrutura/:id', app.isLoggedIn, function(req, res) {
    res.render("estrutura", {
      address : '/cif/' + req.params['id']
    });
  });

  return router;
};
