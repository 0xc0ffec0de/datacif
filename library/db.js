module.exports = function(func) {
  console.log("Conectando o servidor de banco de dados...");
  var MongoClient = require("mongodb").MongoClient;
  var Constants   = require("./constants");  

  return MongoClient.connect(Constants.SERVER, function(err, db) {
    if (err) {
      throw err;
	} else {
      console.log("Conexão OK!");
      func(db);
	}
  });
};