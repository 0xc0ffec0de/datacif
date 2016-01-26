require('../library/class');

var Error = Class.extend({

    message: null,

    value: 0,

    init: function (aMsg, aValue) {
        message = aMsg;
        value = aValue;
    }

});

module.exports = {
    Error: Error
};
