module.exports      = function(app, db) {
  console.log("Carregando módulo passport...");
  var passport      = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var ObjectId      = require('mongodb').ObjectId;

  // Setup de sessão.
  passport.serializeUser(function(user, done) {
    done(null, user._id.toString());
  });

  passport.deserializeUser(function(id, done) {
    var users = db.collection('usuarios');

    users.findOne({ _id: new ObjectId(id) }, function(err, user) {
      done(err, user);
    });
  });

  // Autenticação usando passport.
  passport.use('local-login', new LocalStrategy(
    {
      usernameField : 'login',
      passwordField : 'senha',
      passReqToCallback : true
    },
	function(req, login, pass, done) {
      var users = db.collection('usuarios');

      process.nextTick(function() {
        users.findOne({ login: login }, function(err, user) {
          if (err) {
            console.log("Erro detectado: " + err);
            return done(err);
          }

          if (!user) {
            console.log("Usuário não encontrado.");
            return done(null, false, req.flash('message', 'Usuário não encontrado.'));
          }

          if (user.senha != pass) {
            console.log("Senha incorreta.");
            return done(null, false, req.flash('message', 'Senha incorreta.'));
          }

          console.log("passport login: OK");
          return done(null, user);
        });
      });
    }
  ));

  return passport;
}