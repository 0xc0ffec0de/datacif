// Dependencies
var fs        = require('fs');
var Mongolian = require('mongolian');

// Load database.
var server    = new Mongolian;
var db        = server.db('pf');

// Get document, or throw exception on error
try {
  var doc = fs.readFileSync('./profissoes.txt').toString().split("\n");

  doc.forEach(function(line) {
    var desc = line.split("\t");
    console.log(desc[0], '#', desc[1]);

    db.collection('profissoes').insert({ codigo: desc[0], descricao: desc[1] },
      function(err, db) {
        throw err;
    });

  });

  //process.exit(0);

} catch (e) {
  console.log(e);
  process.exit(1);
}
