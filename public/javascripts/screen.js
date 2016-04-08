//
// Funções de interface (tela) do cliente.
//

var screen = {

    createChapter: function (id, $accordion, chapter, titles, page, jsonData) {
        console.log("createChapterPage() called.");
    },
    /**
     *
     * @param radio
     * @param value
     */
    changeRadio: function ($radio, value) {
        if ($radio.length) {
            console.log('changeRadio(%s) called.', $radio.attr('id'));
            $radio.prop('checked', 'checked');
            $radio.button('refresh');
            $radio.trigger('change');
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
    changeSelection: function ($control, value, criteria) {
        //console.log("changeSelection() called with", $control);
        var options = $control.children();

        for (var index = 0; index < options.length; ++index) {
            var $option = $(options[index]);
            if (criteria[index](value)) {
                $option.attr('selected', 'selected');
            }
        }

        $control.selectmenu('refresh');
    },

    /**
     * Atualiza um controle com um valor por tipo de controle.
     * @param control
     * @param value
     */
    updateControl: function (control, value) {
        console.log('updateControl() called with', control, ', ', value);

        if (control.substr(0, 1) == 'b') {
            value = value.pop();

            if (value <= 4) {
                // Capacidade
                var $radio = $(sprintf('#%s-selectmenu1-radio-1', control));
                this.changeRadio($radio, value);
            }
            else if (!isNaN(value)) {
                // Incapacidade
                // TODO: mover isto para o servidor de alguma maneira.
                var criteria = [
                    function (x) {
                        return x >= 5 && x <= 24;
                    },
                    function (x) {
                        return x >= 25 && x <= 49;
                    },
                    function (x) {
                        return x >= 50 && x <= 95;
                    },
                    function (x) {
                        return x >= 96 && x <= 100;
                    }
                ];
                var $select = $(sprintf('#%s-selectmenu1', control));
                var $radio = $(sprintf('#%s-selectmenu1-radio-2', control));
                this.changeSelection($select, value, criteria);
                this.changeRadio($radio, value);
            }
            else if (value == "NE") {
                // (N)ão (E)specificado
                var $radio = $(sprintf('#%s-selectmenu1-radio-3', control));
                this.changeRadio($radio, value);
            }
            else if (value == "NA") {
                // (N)ão (A)plicável
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
            disableServerComm();
            this.updateControl(cntrl, value)
            enableServerComm();
        }
    }

};
