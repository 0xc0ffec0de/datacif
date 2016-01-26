// Dependências
var express   = require('./config/express');
var app       = express();
var passport;

var db = require('./config/db')(function(db) {
  passport = require('./config/passport')(app, db);
  routes   = require('./config/routes')(app, db, passport);
  //app.initialize(passport);
});

// Exibe mensagens de erro.
//app.get('/flash', function(req, res){
//  // Set a flash message by passing the key, followed by the value, to req.flash().
//  req.flash('info', 'Flash is back!');
//  res.redirect('/');
//});

module.exports = app;
