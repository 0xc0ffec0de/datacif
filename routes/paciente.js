var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.location("/paciente/lista");
  res.redirect("/paciente/lista");
});

router.get('/lista', function(req, res) {
  var db = req.db;
  var pacientes = db.get('pacientes');
  pacientes.find({}, { sort : 'nome' }, function(e, docs) {
    res.render('pacientes', {
      title : 'Lista de todos os pacientes',
      pacientes : docs
    });
  });
});

router.get('/edita/:id', function(req, res) {
  var id = req.params['id'];
  var db = req.db;
  var pacientes = db.get('pacientes');

  pacientes.findOne({ _id: id }, {}, function(err, docs) {
    if (err) {
      res.send("Erro ao tentar editar um paciente");
    } else if (docs) {
      var queryResult = {
        title : "Edita paciente",
        _id : docs._id,
        nome : docs.nome,
        dataNascimento : docs.dataNascimento,
        sexo : docs.sexo == 'm' ? true : false,
        cpf : docs.cpf,
        logradouro : docs.endereco.logradouro,
        complemento : docs.endereco.complemento,
        bairro : docs.endereco.bairro,
        cep : docs.endereco.cep,
        morbidades : docs.morbidades,
        address : '/paciente/altera'
      };

      res.render('paciente', queryResult);
    }
  });
});

router.get('/novo', function(req, res) {
  res.render('paciente', {
    title : 'Adiciona novo paciente',
    _id : '',
    nome : '',
    dataNascimento : '',
    sexo : '',
    cpf : '',
    logradouro : '',
    complemento : '',
    bairro : '',
    cep : '',
    morbidades : [],
    address : '/paciente/adiciona'
  });
});

router.post('/adiciona', function(req, res) {
  var db = req.db;
  var paciente = {
    nome : req.body.nome,
    dataNascimento : req.body.dataNascimento,
    sexo : req.body.sexo,
    cpf : req.body.cpf,
    morbidades : req.body.morbidades.slice(1, req.body.morbidades.length)
  };
  console.log(req.body);

  var endereco = {
    logradouro : req.body.logradouro,
    complemento : req.body.complemento,
    bairro : req.body.bairro,
    cep : req.body.cep
  };

  paciente.endereco = endereco;

  var pacientes = db.get('pacientes');
  pacientes.insert(paciente, function(err, doc) {
    if (err) {
      res.send("Erro ao tentar inserir um novo paciente");
    } else {
      res.location("/paciente/lista");
      res.redirect("/paciente/lista");
    }
  })
});

router.post('/altera', function(req, res) {
  var db = req.db;

  var paciente = {
    _id : req.body._id,
    nome : req.body.nome,
    dataNascimento : req.body.dataNascimento,
    sexo : req.body.sexo,
    cpf : req.body.cpf,
    morbidades : req.body.morbidades.slice(1, req.body.morbidades.length)
  };

  var endereco = {
    logradouro : req.body.logradouro,
    complemento : req.body.complemento,
    bairro : req.body.bairro,
    cep : req.body.cep
  };

  paciente.endereco = endereco;
  console.log(req.body);

  var pacientes = db.get('pacientes');
  pacientes.update({ _id: req.body._id }, paciente,
    function(err, doc) {
      if (err) {
        res.send("Erro ao tentar alterar um paciente");
      } else {
        res.location("/paciente/lista");
        res.redirect("/paciente/lista");
      }
    });
});

module.exports = router;
