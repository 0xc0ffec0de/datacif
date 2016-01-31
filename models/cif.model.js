// Carrega classe pai.
require('../library/class');

var CIF_Model = Class.extend({

    res: null,

    req: null,

    init: function (aReq, aRes) {
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

    /**
     * Zera array com códigos da CIF preenchidos.
     * @param array
     * @returns {Array|*}
     */
    zerify: function (array) {
        result = new Array(array.length);
        for (var index in result) {
            result[index] = 0;
        }
        return result;
    },

    /**
     * Cria array para armazenar dados de acordo com o domínio do CIF.
     * @param cif
     * @returns {number[]}
     */
    zero: function (cif) {
        switch (cif.substr(0, 1)) {
            case 'b':
                return [0];
            case 's':
                return [0, 0]; // adicional sugerido
            case 'd':
                return [0];
            case 'e':
                return [0];
        }
    },

    /**
     * Escreve um valor no nó pai de acordo com o conteúdo dos filhos.
     * @param patient o id do paciente
     * @param jsParent a estrutura do nó parente a ser escrita
     * @param pos o qualificador na CIF do dado a ser escrito
     * @param func(patient, cif, values[, error]) a função a ser executada ao fim do processo, com ou sem erro.
     */
    writeParentNodeData: function (patient, jsParent, pos, func) {
        if (!jsParent) {
            console.log('Parâmetro `jsParent` não pode ser nulo.');
            return;
        }

        console.log("writeParentNodeData() called with pos = ", pos);
        var Dados_Model = require('./dados.model')(req, res);
        var sum = 0;
        var counter = 0;
        var override = false;

        for (var index in jsParent.items) {
            Dados_Model.readDataAndCall(patient, jsParent.items[index].cif, undefined, function (pacient, cif, values, error) {
                if (!error) {
                    counter++;

                    if (!isNaN(values[pos])) {
                        sum += parseFloat(values[pos]);
                        override = true;
                    }

                    // Último item somado.
                    if (counter == jsParent.items.length) {
                        console.log("writeParentNodeData) value = " + sum + " / " + counter + " = " + (sum / counter));
                        var value = sum / counter;
                        console.log("[0]value = " + value);

                        if (override) Dados_Model.updateDataAndCall(patient, jsParent.cif, pos, value, func);
                        else func(patient, jsParent.cif, value);
                    }
                } else {
                    if (func !== undefined) func(patient, cif, undefined, error);
                }
            });
        }
    },

    /**
     * Encontra elemento com o cif especificado na estrutura.
     * @param jsStructure a estrutura
     * @param cif o código do elemento a procurar
     * @returns {*}
     */
    findStructure: function (jsStructure, cif) {
        // Condição de parada encontrada.
        if (jsStructure.cif == cif) {
            return jsStructure;
        }
        else {
            var name = cif.substr(0, jsStructure.cif.length + 1);
            var found = false;

            for (var index in jsStructure.items) {
                if (jsStructure.items[index].cif == name) {
                    found = true;
                    jsStructure = jsStructure.items[index];
                    break;
                }
            }
            return found ? this.findStructure(jsStructure, cif) : "lulz";
        }

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
        else {
            var name = node.substr(0, jsParent.cif.length + 1);
            var found = false;
            console.log("findAdjacentParent between ", jsParent.cif, "and ", name, " first.");

            for (var index in jsParent.items) {
                console.log("findAdjacentParent: ", jsParent.cif, "and ", name, " first.");
                if (jsParent.items[index].cif == name) {
                    found = true;
                    jsParent = jsParent.items[index];
                    break;
                }
            }
            return found ? this.findAdjacentParent(jsParent, node) : null;
        }
    },

    /**
     * Escreve recursivamente nos nós parentes ao nó especificado.
     * @param patient o id do paciente
     * @param jsParent a estrutura a ser atualizada
     * @param node o nó do elemento atual
     * @param pos o qualificador da CIF a ser atualizado
     * @param func([error]) função executada ao fim da operação, com ou sem erro.
     */
    recursiveWriter: function (patient, jsParent, node, pos, func) {
        console.log("recursiveWriter() called.");
        // Condição de parada: retorna sem fazer nada.
        if (node.length == jsParent.cif.length) {
            if (func !== undefined) {
                func();
            }
        }
        // Obtem o parente adjacente ao nível do nó.
        else if (node.length > jsParent.cif.length + 1) {
            console.log("findAdjacentParent between ", jsParent.cif, "and ", node);
            jsNewParent = _cif_model.findAdjacentParent(jsParent, node);
            console.log("findAdjacentParent returned ", jsNewParent);
            _cif_model.writeParentNodeData(patient, jsNewParent, pos, function (patient, cif, values, error) {
                if (!error) {
                    _cif_model.recursiveWriter(patient, jsParent, jsNewParent.cif, pos, func);
                } else {
                    if (func !== undefined) func(error);
                }
            });
        }
        // Parente já é adjacente.
        else {
            this.writeParentNodeData(patient, jsParent, pos, function (patient, cif, values, error) {
                if (func !== undefined) func(error);
            });
        }
    },

    /**
     * Processa o ramo da CIF executando a função func na estrutura onde o nó se encontra.
     * @param patient o código do paciente
     * @param parent o código CIF do nó parente inicial do ramo
     * @param cif o código da CIF.
     * @param pos a identificação de qualificador da CIF
     * @param function(patient, jsParent, node, pos [, error]) função a ser executada quando o resultado for retornado.
     */
    processCIFBranch: function (patient, parent, cif, pos, func) {
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
                if (func !== undefined) func(patient, undefined, cif, pos, error);
            } else if (result.length == 1) {
                console.log("processCIFBranch() encontrou 1 resultado");
                if (func !== undefined) func(patient, result[0], cif, pos);
            } else {
                // Nenhum parente encontrado.
                console.log("processCIFBranch(): nenhum dado encontrado.");
                if (func !== undefined) func(patient, undefined, cif, pos);
            }
        });
    },

    /**
     * Propaga os valores da CIF para níveis mais baixos (em direção à raiz).
     * @param patient id do paciente.
     * @param cif código da cif cujo valor foi alterado.
     * @param value o valor alterado.
     * @param func([error]) função executada ao terminar o processo, com ou sem erro
     */
    // Propaga valor da CIF para níveis mais baixos.
    processCIFDownwards: function (patient, cif, pos, func) {
        console.log("processCIFDownwards() called.");
        var recursiveWriter = this.recursiveWriter.bind(this);

        switch (cif.length) {
            case 4: // 1o nível
                console.log("processCIFDownwards: nothing to do.");
                if (func !== undefined) func();
                return;
            case 5: // 2o nível
                var parent = cif.substr(0, 4);
                console.log("processCIFDownwards: calling processCIFBranch() with " + parent);
                this.processCIFBranch(patient, parent, cif, pos, function (patient, jsParent, node, pos, error) {
                    if (!error) {
                        recursiveWriter(patient, jsParent, node, pos, func);
                    } else {
                        if (func !== undefined) func(error);
                    }
                });
                break;
            case 6: // 3o nível
                var parent = cif.substr(0, 4);
                console.log("processCIFDownwards: calling processCIFBranch() with " + parent);
                this.processCIFBranch(patient, parent, cif, pos, function (patient, jsParent, node, pos, error) {
                    if (!error) {
                        recursiveWriter(patient, jsParent, node, pos, func);
                    } else {
                        if (func !== undefined) func(error);
                    }
                });
                break;
        }
    }

});

// Espaço para objeto singleton.
GLOBAL._cif_model = null;

module.exports = function (req, res) {
    // Impede a reinstanciação e retorna o objeto já criado.
    if (!GLOBAL._cif_model) {
        GLOBAL._cif_model = new CIF_Model(req, res);
    }
    return GLOBAL._cif_model;
};