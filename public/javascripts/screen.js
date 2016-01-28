//
// Funções de interface (tela) do cliente.
//

var screen = {

    /**
     *
     * @param radio
     * @param value
     */
    changeRadio: function(radio, value) {
        if ($radio.length) {
            $radio.prop('checked', true);
        } else {
            console.log(sprintf('radio `%s` não encontrado.', $radio.selector));
        }
    },

    /**
     *
     * @param control
     * @param value
     * @param criteria
     */
    changeSelection: function($control, value, criteria) {

        $control.child().each(function()
        {
            console.log("option: ", ($this));
            if (criteria[i](($this).val())) {
                ($this).prop('selected', '')
            } else {
                ($this).removeProp('selected');
            }
        });
    },

    /**
     * Atualiza um controle com um valor por tipo de controle.
     * @param control
     * @param value
     */
    updateControl: function (control, value) {
        console.log('updateControl() called with', control, ', ', value);
        console.log("%s", sprintf("bla %s", control));

        if (control.substr(0, 1) == 'b') {
            value = value.pop();

            if (value === 0) {
                // Capacidade
                //$('b110-selectmenu1-radio-1').prop("checked", true);
                console.log('updateControl(): ', value, ' = capacidade');
                var $radio = $(sprintf('#%s-selectmenu1-radio-1', control));
                this.changeRadio($radio, value);
            }
            else if (!isNaN(value)) {
                // Incapacidade
                //$('b110-selectmenu1-radio-2').prop("checked", true);
                var criteria = [
                    function (x) { return x >= 5  && x <= 24;  },
                    function (x) { return x >= 25 && x <= 49;  },
                    function (x) { return x >= 50 && x <= 95;  },
                    function (x) { return x >= 96 && x <= 100; }
                ];

                console.log('updateControl(): ', value, ' = incapacidade');
                var $select = $(sprintf('#%s-selectmenu1', control));
                var $radio = $(sprintf('#%s-selectmenu1-radio-2', control));
                this.changeSelection($select, value, criteria);
                this.changeRadio($radio, value);
            }
            else if (value == "NE") {
                // (N)ão (E)specificado
                //$('b110-selectmenu1-radio-3').prop("checked", true);
                console.log('updateControl(): ', value, ' = NE');
                var $radio = $(sprintf('#%s-selectmenu1-radio-3', control));
                this.changeRadio($radio, value);
            }
            else if (value == "NA") {
                // (N)ão (A)plicável
                //$('b110-selectmenu1-radio-4').prop("checked", true);
                console.log('updateControl(): ', value, ' = NA');
                var $radio = $(sprintf('#%s-selectmenu1-radio-4', control));
                this.changeRadio($radio, value);
            }
        }
    },

    /**
     * Atualiza tela com dados recebidos do servidor em formato json.
     * @param jsonData
     */
    update: function (jsonData) {
        console.log("screen.update() called with jsonData = ", jsonData);

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
