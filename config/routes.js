module.exports = function(app, db, passport) {
  console.log("Configurando rotas...");
  var path          = require('path');
  var Constants     = require("./constants");  
  var flash         = require('connect-flash');

  // Inicializa configuração de app usando o passport.
  app.use(passport.initialize());
  app.use(passport.session());

  // Torna BD accessível pelo roteador.
  app.use(function(req, res, next) {
	req.db = db;
	next();
  });
	  
  // Define rotas.
  for (var index in Constants.ROUTES) {
	  var file = path.join(Constants.ROOT_PATH, Constants.ROUTE_PATH, Constants.ROUTES[index]);
	  console.log("Carregando rota '" + file + "'");
	  var route = require(file)(app, passport);
	  app.use(Constants.URLS[index], route);
  }  

  // Captura 404 e redireciona para o controle.
  app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
  });

  // Erro de desenvolvimento. Imprime stacktrace.
  if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
  }

  // Erro de produção. Sem stacktrace.
  app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
  });
  
  // Exive mensagem de erro com o módulo flash.
  app.use(flash());
  
  app.get('/flash', function(req, res) {
	// Define uma mensagem flash ao passar a chave e valor para req.flash().
    req.flash('info', 'Flash is back!');
    res.redirect('/');
  });

};