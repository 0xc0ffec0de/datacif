// Carrega classe pai.
require('./class');

var PacienteController = Class.extend({

    init: function(req, res){
      this.req = req;
      this.res = res;
    },

    dance: function(){
      return "dance!";
    }
});

module.exports = function(req, res) {
    return new PacienteController(req, res);
};