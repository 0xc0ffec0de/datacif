// Carrega classe pai.
require('./class');

var CIF_Model = Class.extend({

    self: null,

    res: null,

    req: null,

    init: function (aReq, aRes) {
        console.log("CIF_Model.init() called.");
        req = aReq;
        res = aRes;
        self = this;
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
                    list = self.collectCIF(list, node.items[index]);
                }
            }
        }

        return list;
    },

    /**
     *
     * @param patient
     * @param jsParent
     * @param node
     * @param value
     */
    writeParentNodeData: function (patient, jsParent) {
        console.log("writeParentNodeData() called.");
        var Patient_Model = require('./paciente.model')(req, res);
        var sum = 0;

        for (var index in jsParent.items) {
            Patient_Model.readDataAndCall(patient, jsParent.items[index].cif, function (pacient, cif, values) {
                sum += values[0];
                console.log("[0]Sum = " + sum);
            });
        }

        console.log("[1]Sum = ", sum);
    },

    /**
     * Encontra o ramo parente imediato de nó
     * @param jsParent o ramo da busca
     * @param node o nó filho
     * @returns {*}
     */
    findAdjacentParent: function (jsParent, node) {
        // Condição de parada encontrada.
        if (node.length == jsParent.cif.length + 1) {
            return jsParent;
        }
        else
        {
            var name = node.substr(0, jsParent.cif.length + 1);
            var found = false;

            for (var item in jsParent.items) {
                if (item.cif == name) {
                    found = true;
                    jsParent = item;
                    break;
                }
            }
            return found ? self.findAdjacentParent(jsParent, node) : null;
        }
    },

    /**
     *
     * @param patient
     * @param jsParent
     * @param node
     */
    recursiveWriter: function (patient, jsParent, node) {
        console.log("recursiveWriter() called.");
        // Condição de parada: retorna sem fazer nada.
        if (node.length == jsParent.cif.length) {
            return;
        }
        // Obtem o parente adjacente ao nível do nó.
        else if (node.length > jsParent.cif.length + 1) {
            jsNewParent = self.findAdjacentParent(jsParent, node);
            console.log("findAdjacentParent returned ", jsNewParent);
            self.writeParentNodeData(patient, jsNewParent, node);
            var next = parent.substr(0, parent.length - 1);
            self.recursiveWriter(patient, jsParent, next);
        }
        // Parente já é adjacente.
        else {
            //console.log("this = ", self);
            self.writeParentNodeData(patient, jsParent, node);
        }
    },

    /**
     * Processa o ramo da CIF.
     * @param cif o código da CIF.
     * @param func função a ser executada quando o resultado for retornado.
     */
    processCIFBranch: function (patient, parent, cif, func) {
        console.log("processCIFBranch() called with: ", parent, ": ", cif);
        var items = req.db.collection('itens');

        // Acha o item parente no banco de dados.
        items.aggregate([
            {$match: {cif: parent}},
            {$project: {_id: 0, cif: "$cif", description: "$description", items: "$items"}},
            {$sort: {cif: 1}}
        ]).toArray(function (error, result) {
            if (error) {
                console.log("processCIFBranch(): ", error.message);
            } else if (result.length == 1) {
                console.log("processCIFBranch() encontrou 1 resultado");
                if (func !== undefined) {
                    func(patient, result[0], cif);
                }
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
    processCIFDownwards: function (patient, cif) {
        console.log("processCIFDownwards() called.");
        // 1# nível?
        switch (cif.length) {
            case 4: // 1o nível
                console.log("processCIFDownwards: nothing to do.");
                return;
            case 5: // 2o nível
                var parent = cif.substr(0, 4);
                console.log("processCIFDownwards: calling processCIFBranch() with " + parent);
                self.processCIFBranch(patient, parent, cif, self.recursiveWriter);
                break;
            case 6: // 3o nível
                var parent = cif.substr(0, 4);
                console.log("processCIFDownwards: calling processCIFBranch() with " + parent);
                self.processCIFBranch(patient, parent, cif, self.recursiveWriter);
                break;
        }
    }

});

module.exports = function (req, res) {
    return new CIF_Model(req, res);
};