// Carrega classe pai.
require('./class');

var Paciente_Model = Class.extend({

    req: null,

    res: null,

    init: function (aReq, aRes) {
        console.log("Paciente_Model.init() called.");
        req = aReq;
        res = aRes;
    },

    dance: function () {
        return "dance!";
    },

    /**
     * Escreve dados da CIF sobre paciente.
     * @param patient o ID do paciente
     * @param cif o código CIF do dado
     * @param values o valor do dado propriamente dito
     * @param func a função a ser executada em seguida
     */
    writeDataAndCall: function (patient, cif, values, func) {
        var data = req.db.collection('dados');

        data.findAndModify(
            {p: patient, c: cif}, // query
            [['c', 1]], // sort
            {$set: {v: values}}, // replacement
            {upsert: true}, // options
            function (error, result) {
                if (error) {
                    console.log('writeDataAndCall: ', error.message);
                    if (func !== undefined) {
                        func(patient, cif, values, error);
                    }
                }
                else {
                    console.log("writeDataAndCall() successful.");
                    if (func !== undefined) {
                        func(patient, cif, values);
                    }
                }
            }
        );
    },

    /**
     * Le dados do paciente e chama função especificada.
     * @param patient o id do paciente
     * @param cif o código da CIF do dado a ser lido
     * @param func a função a ser executada com o dado obtido
     */
    readDataAndCall: function (patient, cif, func) {
        var data = req.db.collection('dados');

        // Obtem valor antigo do dado do paciente.
        data.aggregate([
            {$match: {p: patient, c: cif}},
            {$project: {v: "$v"}}
        ]).toArray(function (err, result) {
            var result = result[0];
            var values;

            if (err) {
                res.send("Erro ao tentar encontrar dados do paciente.");
                return false;
            } else if (!result) {
                values = [];
            } else {
                values = result.v;
            }

            // Chama função com o resultado obtido.
            if (func !== undefined) {
                func(patient, cif, values);
            }
        });
    },

    // Propaga valor da CIF para níveis mais altos (em direção às folhas).
    cascadeUpdate: function(patient, cif, values, func) {
        var CIF_Model = require('./cif.class')(req, res);
        var items = req.db.collection('itens');
        var data = req.db.collection('dados');
        var that = this;
        console.log("cascadeUpdate called.", cif);

        items.aggregate([
            { $match: { cif : cif } },
            { $project: { cif : "$cif", items : "$items" } }
        ]).toArray(function(error, result) {
            console.log("aggregate returned ", result[0]);

            if (error) {
                console.log('cascadeUpdate: ', error.message);
                func(patient, cif, values, error);
            }
            else if (result[0] && result[0].items) {
                var operations = 0;
                var errors = false;
                var list = CIF_Model.collectCIF([], result[0]); // collectCIF(list, result[0]);
                console.log("list = ", list);

                // Atualiza todos os itens daquele ramo.
                for (index in list) {
                    that.writeDataAndCall(patient, list[index], values, function (patient, cif, values, error) {
                        operations++;
                        errors |= error;

                        if (operations == list.length) {
                            func(patient, cif, values, errors);
                        }
                    });
                }
            }
        });
    }

});

module.exports = function (req, res) {
    return new Paciente_Model(req, res);
};