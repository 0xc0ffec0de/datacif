module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();

  router.get('/', app.isLoggedIn, function(req, res) {
    res.location("/usuario/lista");
    res.redirect("/usuario/lista");
  });

  // Create a new user
  router.get('/novo', app.isLoggedIn, function(req, res) {
    var db = req.db;
    res.render('usuario', {
      title : 'Dados do usuário',
      address : '/usuario/adiciona'
    });
  });

  router.post('/adiciona', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var users = db.collection('usuarios');

    var user = {
      nome : req.body.nome,
      login : req.body.login,
      senha : req.body.senha,
      admin : false
    };
    console.log("user", user);

    users.insert(user, function(err, result) {
      if (err) {
        console.log("Erro ao tentar criar um novo usuário", err);
        res.send("Erro ao tentar criar um novo usuário");
      } else {
        res.location("/usuario/lista");
        res.redirect("/usuario/lista");
      }
    })
  });

  router.get('/lista', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var users = db.collection('usuarios');

    users.find().sort({ 'nome' : 1 }).toArray(function(err, result) {
      if (err) {
        res.send("Erro ao tentar listar usuários");
      }

      res.render('usuarios', {
        title : 'Lista de todos os usuários',
        usuarios : result
      });
    });
  });

  router.get('/profissao/:desc', function(req, res) {
    var descricao = new RegExp(req.params['desc'], 'i');
    var db = req.db2;
    var profissoes = db.collection('profissoes');

    // profissoes.find({ descricao: descricao }).toArray(function(err, result) {
    profissoes.aggregate([
      { $match: { descricao: descricao } },
      { $project: { _id : 0, "label" : "$descricao", codigo : 1 } }
    ]).sort({ 'descricao:' : 1}).toArray(function(err, result) {
      if (err) {
        res.send("Erro ao tentar ler dados de profissão");
      } else if (result) {
        res.send(result);
      } else {
        res.send([]);
      }
    });
  });

  return router;
}
