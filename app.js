// Dependências
var express   = require('./library/express');
var app       = express();
var passport;

var db       = require('./library/db')(function (db) {
    hbs      = require('./library/hbs')();
    passport = require('./library/passport')(app, db);
    routes   = require('./library/routes')(app, db, passport);
});

module.exports = app;
