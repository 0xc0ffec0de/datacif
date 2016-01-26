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
            function (err, result) {
                if (err) {
                    console.log(err.message);

                    if (func !== undefined) {
                        func(patient, cif, values, err);
                    }
                }
                else {
                    console.log("writeDataAndCall() successful.");

                    if (func !== undefined) {
                        func(patient, cif, values, null);
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
    }

});

module.exports = function (req, res) {
    return new Paciente_Model(req, res);
};