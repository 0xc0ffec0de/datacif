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

  router.get('/login', function(req, res) {
    var db = req.db;
    res.render('login', {
      title : 'Digite usuário e senha',
      address : '/login/credentials'
    });
  });

    router.post('/login/credentials', passport.authenticate('local-login', {
      successRedirect : '/paciente/lista',
      failureRedirect : '/login',
      failureFlash    : true // allow flash messages
  }));

  return router;
};
