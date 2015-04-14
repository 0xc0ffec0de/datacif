module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();

  // Create a new user
  router.get('/novo', app.isLoggedIn, function(req, res) {
    var db = req.db;
    res.render('usuario', {
      title : 'Dados do usuário',
      address : '/usuario/adiciona'
    });
  });

  router.post('/adiciona', app.isLoggedIn, function(req, res, done) {
    var db = req.db;
    var users = db.get('usuarios');
    var user = {
      nome : req.body.nome,
      login : req.body.login,
      senha : req.body.senha,
    };

    users.insert(user, function(err, result) {
      if (err) {
        console.log("Erro ao tentar criar um novo usuário");
        res.send("Erro ao tentar criar um novo usuário");
      } else {
        res.location("/usuario/lista");
        res.redirect("/usuario/lista");
      }
    })
  });

  router.get('/lista', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var users = db.get('usuarios');

    users.find({}, { sort : 'nome' }, function(e, result) {
      res.render('usuarios', {
        title : 'Lista de todos os usuários',
        usuarios : result
      });
    });
  });

  return router;
}
