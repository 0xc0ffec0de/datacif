module.exports   = function(app, db, passport) {
    var express  = require('express');
    var router   = express.Router();
    var mongodb  = require('mongodb');
    var ObjectId = mongodb.ObjectId;

    // Menu inicial.
    router.get('/:id', app.isLoggedIn, function(req, res) {
        var pacientes = db.collection('pacientes');
        var id = req.params.id;

        pacientes.aggregate([
                { $match : { _id : new ObjectId(id) } },
                { $project : { _id : 0, sexo : 1 } },
            ], function(err, result) {
                console.log("result = ", result);
                if (err) {
                    console.log("DB ERROR:", err);
                    res.render('/sujeito/listar', { messages: req.flash('Erro ao ler dados de sujeito') });
                } else if (result) {
                    var sexo = result.pop().sexo;
                    res.render("dominio/selecionar",
                        {
                            sujeito: {
                                _id  : req.params.id,
                                masc : sexo == 'm'
                            }
                        });
                }
            }
        );
    });

    return router;
};
