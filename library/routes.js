// app = express app
// db = database
// passport = user access engine
// tmpl = template engine
module.exports    = function (app, db, passport) {
    console.log("Configurando rotas...");
    var constants = require("../config/constants");
    var path      = require('path');
    var flash     = require('connect-flash');

    // Inicializa configuração de app usando o passport.
    app.use(passport.initialize());
    app.use(passport.session());

    // Define rotas.
    for (var index in constants.ROUTES) {
        var file = path.join(constants.ROOT_PATH, constants.ROUTE_PATH, constants.ROUTES[index]);
        console.log("Carregando rota '" + file + "'");
        var route = require(file)(app, db, passport);
        app.use(constants.URLS[index], route);
    }

    // Captura 404 e redireciona para o controle.
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // Erro de desenvolvimento. Imprime stacktrace.
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // Erro de produção. Sem stacktrace.
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    // Exibe mensagem de erro com o módulo flash.
    // app.use(flash());

    app.get('/flash', function (req, res) {
        // Define uma mensagem flash ao passar a chave e valor para req.flash().
        req.flash('info', 'Flash is back!');
        res.redirect('/');
    });

};
