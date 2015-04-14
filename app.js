var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session       = require('express-session');
var flash         = require('connect-flash');

// New dependencies
var mongo = require('mongodb');
var monk  = require('monk');

// Load database.
var db = monk('localhost/pf');

// Passport session setup
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  users = db.get('usuarios');
  users.findById(id, function(err, user) {
    done(err, user);
  });
});

// Passport authentication
passport.use('local-login', new LocalStrategy(
  {
    usernameField : 'login',
    passwordField : 'senha',
    passReqToCallback : true
  },
  function(req, login, pass, done) {
    var users = db.get('usuarios');

    process.nextTick(function() {
    users.findOne({ login: login }, function (err, user) {
      if (err) { return done(err); }

      if (!user) {
        console.log("Usuário não encontrado.");
        return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'));
      }

      if (user.senha != pass) {
        console.log("Senha incorreta.");
        return done(null, false, req.flash('loginMessage', 'Senha incorreta.'));
      }

      console.log("OK")
      return done(null, user);
    });
  });
  }
));

// configure Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session stuff
app.use(session({ secret: 'whatdoesthefoxsay?',
                  resave: false,
                  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Static files at public.
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req, res, next){
    req.db = db;
    next();
});

// Simple route middleware to ensure user is authenticated.
app.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// Simple route middleware to ensure user is admin.
app.isAdmin = function(req, res, next) {
  console.log(req);
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/paciente/lista');
}

// Define routes
var paciente = require('./routes/paciente')(app, passport);
var cif      = require('./routes/cif')(app, passport);
var login    = require('./routes/login')(app, passport);
var usuario  = require('./routes/usuario')(app, passport);

//app.use('/', base);
app.use('/paciente', paciente);
app.use('/cif', cif);
app.use('/login', login);
app.use('/usuario', usuario);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
