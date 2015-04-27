// Dependencies
var yaml      = require('js-yaml');
var fs        = require('fs');
var Mongolian = require('mongolian');

// Load database.
var server    = new Mongolian;
var db        = server.db('pf');

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./db/cid10.yml', 'utf8'));
  var groups = doc.CID10Tipos;
  var items = doc.CID10;

  //console.log(items);
  //process.exit(0);

  groups.forEach(function(group) {
    db.collection('cid10Groups').insert(group, function(err, db) {
      if (err) throw err;
    });
  });

  items.forEach(function(item) {
    db.collection('cid10Items').insert(item, function(err, db) {
      if (err) throw err;
    });
  });

} catch (e) {
  console.log(e);
  process.exit(1);
}
