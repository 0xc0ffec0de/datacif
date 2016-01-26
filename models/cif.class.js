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
    },

    /**
     * Varre estrutura de dados da CIF procurando códigos de filhos daquele código CIF.
     * @param list a lista de códigos com os códigos filhos
     * @param node o nó que será vasculhado
     * @returns {*}
     */
    collectCIF: function (list, node) {
        if (node && node.cif) {
            list.push(node.cif);

            if (node.items) {
                for (index in node.items) {
                    console.log("collectCIF(%s)", node.items[index]);
                    list = this.collectCIF(list, node.items[index]);
                }
            }
        }

        return list;
    },

    writeParentNodeData: function (patient, jsParent, node, value) {
        var Patient_Model = require('./paciente.class')(req, res);
        var cif = node.substr(0, node.length - 1);

        for (var index in jsParent.items) {
            // Encontrado!
            if (jsParent.items[index].cif == cif) {
                Patient_Model.writeDataAndCall(patient, cif, value);
            }
        }
    },

    recursiveWriter: function (patient, jsParent, node) {
        // Condição de parada: retorna sem fazer nada.
        if (node.length == jsParent.cif.length) {
            return;
        }
        // Obtem o parente adjacente ao nível do nó.
        else if (node.length > jsParent.cif.length + 1) {
            var parent = node.substr(0, node.length - 1);
            this.writeParentNodeData(patient, jsParent, parent, value);
            var next = parent.substr(0, parent.length - 1);
            this.bla(patient, jsParent, next, value);
        }
        // Parente já é adjacente.
        else {
            this.writeParentNodeData(patient, jsParent, node, value);
        }
    },

    /**
     * Processa o ramo da CIF.
     * @param cif o código da CIF.
     * @param func função a ser executada quando o resultado for retornado.
     */
    processCIFBranch: function (cif, func) {
        var items = req.db.collection('itens');

        items.aggregate([
            {$match: {cif: cif}},
            {$project: {_id: 0, cif: "$cif", description: "$description", items: "$items"}},
            {$sort: {cif: 1}}
        ]).toArray(function (err, result) {
            if (err) {
                console.log("processCIFBranch(): ", err);
            } else if (result.length == 1) {
                console.log("processCIFBranch() encontrou 1 resultado");
                func(result[0]);
            } else {
                // Nada encontrado.
                console.log("processCIFBranch(): nenhum dado encontrado.");
            }
        });
    },

    /**
     * Propaga os valores da CIF para níveis mais baixos (em direção à raiz).
     * @param patient id do paciente.
     * @param cif código da cif cujo valor foi alterado.
     * @param value o valor alterado.
     */
    // Propaga valor da CIF para níveis mais baixos.
    processCIFDownwards: function (patient, cif, value) {
        // 1# nível?
        switch (cif.length) {
            case 4: // 1o nível
                return;
            case 5: // 2o nível
                var term = cif.substr(0, 3);
                this.processCIFBranch(db, term, cif, bla);
                break;
            case 6: // 3o nível
                var term = cif.substr(0, 3);
                this.processCIFBranch(db, term, cif, bla);
                break;
        }
    }

});

module.exports = function (req, res) {
    return new CIF_Model(req, res);
};