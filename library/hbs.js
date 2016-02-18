module.exports = function(func) {
    console.log("Carregando arquivos de templates...");
    var constants = require("../config/constants");
    var hbs       = require('hbs');

    hbs.registerPartials(constants.ROOT_PATH + '/views/partials');

    hbs.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);

        if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
    });

    return hbs;
};
