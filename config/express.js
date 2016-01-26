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
  var flash         = require('connect-flash');
  var MongoClient   = require("mongodb").MongoClient;
  var Constants     = require("./constants");

  // Configuração de visão (MVC)
  app.set('views', path.join(Constants.ROOT_PATH, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(Constants.ROOT_PATH + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Session stuff
  app.use(session({ secret: 'whatdoesthefoxsay?',
            resave: false,
            saveUninitialized: false }));
            // cookie: { maxAge: 600000 }}));
  app.use(flash());

  // Static files at public.
  app.use(express.static(path.join(Constants.ROOT_PATH, 'public')));

  // Simple route middleware to ensure user is authenticated.
  app.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  };

  // Simple route middleware to ensure user is admin.
  app.isAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/paciente/lista');
    }
  };
  
  return app;
}
