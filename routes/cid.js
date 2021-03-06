module.exports = function(app) {
  var express  = require('express');
  var router   = express.Router();

  router.get('/:cid', function(req, res) {
    var cid = req.params.cid;
    // TODO: usando req.db ao invés de req.db2
    var itens = req.db.collection('cid10Itens');
    var grupos = req.db.collection('cid10Grupos');

    itens.findOne({ nome: cid }, {}, function(err, item) {
      if (err) {
        res.send("Erro ao tentar ler dados de CID");
      } else if (item) {
        grupos.findOne({ nome: item.tipo }, {}, function(err, grupo) {
          if (err) {
            res.send("Erro ao tentar ler dados de CID");
          } else if (grupo) {
            item.grupo = grupo.nome;
            res.send(item);
          }
        });
      } else {
        res.send({});
      }
    });
  });

  router.get('/descricao/:desc', function(req, res) {
    var desc = new RegExp(req.params.desc, 'i');
    var itens = req.db.collection('cid10Itens');

    itens.aggregate([
      { $match: { descricao: desc } },
      { $project: { _id : 0, label : "$descricao", cid : "$nome" } }
    ]).sort({ 'descricao:' : 1}).toArray(function(err, result) {
      if (err) {
        console.log(err);
        res.send("Erro ao tentar ler dados de CID");
      } else if (result) {
        console.log(result);
        res.send(result);
      } else {
        // Nada encontrado.
        res.send([]);
      }
    });
  });

  return router;
};
