//
// Funções de interface (tela) do cliente.
//

var screen = {

    updateControl: function(control, value) {
        if (value === 0) {
            // Capacidade
        }
        else if (!isNaN(value)) {
            // Incapacidade
        }
        else if (value == "NE") {
            // Não especificado
        }
        else if (value == "NA") {
            // Não aplicável
        }
    },

    /**
     * Atualiza tela com dados recebidos do servidor em formato json.
     * @param jsonData
     */
    update: function (jsonData) {
        console.log("screen.update() called.");

        for (var index in jsonData.elements) {
            var cntrl = jsonData.elements[index].pop();
            var value = jsonData.elements[index].pop();
            this.updateControl(cntrl, value)
        }
    },

    bla2: function () {
        console.log("screen.bla2() called.");
    },

    xpt1: function () {
        console.log("screen.xpt1() called.");
        comm.xpt2();
    }

};
