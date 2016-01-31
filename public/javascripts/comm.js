//
// Funções de comunicação cliente <-> servidor.
//

var comm = {
    /**
     * Salva os dados da CIF do paciente.
     * @param cif
     * @param pos
     * @param value
     */
    saveCIF: function (patient, cif, pos, value) {
        console.log("comm.saveCIF() called.");
        var address = "/cif/save/" + cif + "/" + pos + "/" + value;
        console.log("address=", address);
        var data = {id: patient};

        $.post(address, data, function (response) {
            if (response['r'] != 'OK') {
                // TODO: tratamento de erros.
                console.log(response);
            } else {
                console.log("saveCIF() got an OK.");

                if (response['data']) {
                    screen.update(response['data']);
                }
            }
        });
    },

    bla1: function () {
        console.log("comm.bla1() called.");
        this.xpt2();
        screen.bla2();
    },

    xpt2: function () {
        console.log("comm.xpt2() called.");
    }
}
