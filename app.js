// Dependências
var express   = require('./config/express');
var app       = express();
var passport;

var db = require('./config/db')(function(db) {
  passport = require('./config/passport')(app, db);
  routes   = require('./config/routes')(app, db, passport);
});

module.exports = app;
