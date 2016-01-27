//
// Funções de interface (tela) do cliente.
//

var screen = {

    /**
     * Atualiza um controle com um valor por tipo de controle.
     * @param control
     * @param value
     */
    updateControl: function(control, value) {
        console.log('updateControl() called with', control, ', ', value);

        if (control.substr(0, 1) == 'b') {
            value = value.pop();

            if (value === 0) {
                // Capacidade
                console.log('updateControl(): ', value, ' = capacidade');
            }
            else if (!isNaN(value)) {
                console.log('updateControl(): ', value, ' = incapacidade');
                // Incapacidade
            }
            else if (value == "NE") {
                console.log('updateControl(): ', value, ' = NE');
                // Não especificado
            }
            else if (value == "NA") {
                console.log('updateControl(): ', value, ' = NA');
                // Não aplicável
            }
        }
    },

    /**
     * Atualiza tela com dados recebidos do servidor em formato json.
     * @param jsonData
     */
    update: function (jsonData) {
        console.log("screen.update() called.");

        for (var index in jsonData) {
            var cntrl = jsonData[index]['c'];
            var value = jsonData[index]['v'];

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
