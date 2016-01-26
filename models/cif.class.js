// Carrega classe pai.
require('./class');

var CIF_Model = Class.extend({

    res: null,

    req: null,

    init: function (aReq, aRes) {
        console.log("CIF_Model.init() called.");
        req = aReq;
        res = aRes;
    },

    /**
     * Envia estrutura da CIF para o cliente.
     *
     * @param cif string com o código da CIF.
     */
    sendAsJSON: function (cif) {
        var items = req.db.collection('itens');

        items.aggregate([
            {$match: {cif: cif}},
            {$project: {_id: 0, cif: "$cif", description: "$description", items: "$items"}},
            {$sort: {cif: 1}}
        ]).toArray(function (err, result) {
            if (err) {
                console.log(err);
                res.send("Erro ao tentar ler dados do CIF");
            } else if (result.length == 1) {
                //console.log("1 resultado encontrado");
                res.send(result[0]);
            } else {
                // Nada encontrado.
                console.log("erro: nenhum dado encontrado.");
                res.send([]);
            }
        });
    }
});

module.exports = function (req, res) {
    return new CIF_Model(req, res);
};