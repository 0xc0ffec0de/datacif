module.exports  = function(app, passport) {
    var express = require('express');
    var router  = express.Router();
    var hbs     = require('hbs');

    /* GET home page. */
    router.get('/', function(req, res, next) {
        //hbs.registerPartial('menu', file);
        var data = [
            {
                cif: 'b140',
                descricao: 'Funções da atenção'
            },
            {
                cif: 'b147',
                descricao: 'Funções de teste'
            }
        ];
        res.render('body', { data: data });
    });

    return router;
};
