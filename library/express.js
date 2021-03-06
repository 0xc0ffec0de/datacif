module.exports = function(passport) {
  console.log("Carregando servidor express...");

  // Configura o express
  var express       = require('express');
  var app           = express();
  var path          = require('path');
  var logger        = require('morgan');
  var bodyParser    = require('body-parser');
  var cookieParser  = require('cookie-parser');
  var session       = require('express-session');
  var Constants     = require("../config/constants");

  // Configuração de visão do MVC.
  app.set('views', path.join(Constants.ROOT_PATH, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(Constants.ROOT_PATH + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // "Estufas" de sessão
  app.use(session({ secret: 'whatdoesthefoxsay?',
            resave: false,
            saveUninitialized: false }));
            // cookie: { maxAge: 600000 }}));

  // Arquivos em "public" são estáticos.
  app.use(express.static(path.join(Constants.ROOT_PATH, 'public')));

  // Rota de middleware que testa se usuário está autenticado.
  app.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  };

  // Rota de middleware que testa se usuário é administrador.
  app.isAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/paciente/lista');
    }
  };

  return app;
}
