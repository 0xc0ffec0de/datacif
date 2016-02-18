module.exports = function(app, db, passport) {
  var express  = require('express');
  var router   = express.Router();

  // Redireciona para login
  router.get('/', function(req, res) {
    res.render('login', {
      address : '/login/credentials'
    });
  });

  // Tela de login
  router.get('/login', function(req, res) {
    res.render('login', {
      title: 'Digite usuário e senha',
      message: req.flash('message').pop(),
      address: '/login/credentials'
    });
  });

  router.post('/login/credentials', passport.authenticate('local-login', {
      successRedirect : '/paciente/listar',
      failureRedirect : '/login',
      failureFlash    : true // allow flash messages
  }));

  return router;
};
