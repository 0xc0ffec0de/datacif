// Carrega classe pai.
require('../library/class');
require('../library/error.class');

var Paciente_Model = Class.extend({

    self: null,

    req: null,

    res: null,

    init: function (aReq, aRes) {
        self = this;
        req = aReq;
        res = aRes;
    },

    updateDataAndCall: function (patient, cif, pos, value, func) {
        self = this;
        if (isNaN(pos)) {
            var error = new Error("argumento pos não especificado");
            if (func !== undefined) {
                func(patient, cif, undefined, error);
            }
            console.log("updateDataAndCall: " + error.message);
            return;
        }

        self.readDataAndCall(patient, cif, undefined, function (patient, cif, values, error) {
            if (!error) {
                values[pos] = value;
                self.writeDataAndCall(patient, cif, values, func);
            }
            else {
                if (func !== undefined) {
                    func(patient, cif, undefined, error);
                }
                console.log("updateDataAndCall: " + error.message);
            }
        });
    },

    /**
     * Escreve dados da CIF do paciente.
     * @param patient o ID do paciente
     * @param cif o código CIF do dado
     * @param pos posição do dado no array
     * @param value o valor do dado propriamente dito
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
                        func(patient, cif, undefined, error);
                    }
                }
                else {
                    console.log("writeDataAndCall() successful.");
                    if (func !== undefined) {
                        func(patient, cif, values);
                    }
                }
            });
    },

    /**
     * Le dados do paciente e chama função especificada.
     * @param patient o id do paciente
     * @param cif o código da CIF do dado a ser lido
     * @param pos a posição do valor da CIF a ser lido, podendo ser nulo para retornar tudo.
     * @param func a função a ser executada com o dado obtido
     */
    readDataAndCall: function (patient, cif, pos, func) {
        var CIF_Model = require('./cif.model')(req, res);
        var data = req.db.collection('dados');

        // Obtem valor antigo do dado do paciente.
        data.aggregate([
            {$match: {p: patient, c: cif}},
            {$project: {v: "$v"}}
        ]).toArray(function (error, result) {
            result = result[0];
            var value;

            if (error) {
                func(patient, cif, undefined, error);
                return;
            } else if (result instanceof Object) {
                if (pos && result['v']) {
                    value = result.v[pos];
                }
                else if (result['v']) {
                    value = result.v;
                } else if (pos) {
                    // Erro de parsing?
                    value = 0;
                } else {
                    // Erro de parsing?
                    return CIF_Model.zero(cif);
                }
            } else {
                // Provavelmente não inicializado.
                if (pos) {
                    value = 0;
                } else {
                    value = CIF_Model.zero(cif);
                }
            }

            // Chama função com o resultado obtido.
            console.log("readDataAndCall() returned ", value)
            if (func !== undefined) {
                func(patient, cif, value);
            }
        });
    },

    // Propaga valor da CIF para níveis mais altos (em direção às folhas).
    cascadeUpdate: function (patient, cif, values, func) {
        var CIF_Model = require('./cif.model')(req, res);
        var items = req.db.collection('itens');
        var data = req.db.collection('dados');
        var that = this;
        var node = cif.substr(0, 4);
        console.log("cascadeUpdate called with cif = ", cif, ": ", values);

        items.aggregate([
            {$match: {cif: node}},
            {$project: {cif: "$cif", items: "$items"}}
        ]).toArray(function (error, result) {
            console.log("aggregate returned ", result[0]);

            if (error) {
                console.log('cascadeUpdate: ', error.message);
                func(patient, cif, values, error);
            }
            else if (result[0] && result[0].items) {
                var operations = 0;
                var errors = false;
                var jsNode = CIF_Model.findStructure(result[0], cif);
                console.log("jsSelf = " + jsNode);
                var list = CIF_Model.collectCIF([], jsNode);
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

GLOBAL._paciente_model_initialized = false;

module.exports = function (req, res) {
    if (!GLOBAL._paciente_model_initialized) {
        GLOBAL._paciente_model = new Paciente_Model(req, res);
        GLOBAL._paciente_model_initialized = true;
    }
    return GLOBAL._paciente_model;
};