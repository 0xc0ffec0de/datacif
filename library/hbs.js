module.exports = function(func) {
    console.log("Carregando arquivos de templates...");
    var constants = require("../config/constants");
    var hbs       = require('hbs');

    hbs.registerPartials(constants.ROOT_PATH + '/views/partials');

    return hbs;
};
