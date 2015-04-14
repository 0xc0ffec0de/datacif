module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();

  // Login
  router.get('/', function(req, res) {
    var db = req.db;
    res.render('login', {
      title : 'Digite usuário e senha',
      address : '/login/credentials'
    });
  });

  router.post('/credentials', function(req, res, done) {
    var db = req.db;
    var users = db.get('usuarios');
    var login = req.body.login;
    var pass = req.body.pass;

    users.findOne({ usuario: login, senha: pass }, {}, function(err, user) {
      if (err) {
        console.log("usuário não encontrado.");
        return done(err);
      }

      if (!user) {
        console.log("Nome incorreto.");
        return done(null, false, req.flash('loginMessage', 'Nome incorreto.'));
      }

      if (!user.validPassword(pass)) {
        console.log("Senha incorreta.");
        return done(null, false, req.flash('loginMessage', 'Senha incorreta.'));
      }

      console.log("OK");
      return done(null, user);
    })
  });

  return router;
}
