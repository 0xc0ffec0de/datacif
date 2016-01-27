module.exports = function(func) {
  console.log("Conectando o servidor de banco de dados...");
  var mongoClient = require("mongodb").MongoClient;
  var constants   = require("../config/constants");

  return mongoClient.connect(constants.SERVER, function(err, db) {
    if (err) {
      throw err;
    } else {
      console.log("Conexão OK!");
      func(db);
    }
  });
};
