//
// Constantes
//

var path = require('path');

module.exports = {
	SERVER     : "mongodb://localhost:27017/pf",
	ROOT_PATH  : path.dirname(path.dirname(process.mainModule.filename)),
	ROUTE_PATH : 'routes',
	URLS       : [ '/cid', '/paciente', '/cif', '/', '/usuario' ],
	ROUTES     : [ 'cid', 'paciente', 'cif', 'login', 'usuario' ]
};