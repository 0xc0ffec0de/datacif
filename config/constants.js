//
// Constantes
//

var path = require('path');

module.exports = {
	SERVER     : "mongodb://localhost:27017/pf",
	BASE_PATH  : '/',
	ROOT_PATH  : path.dirname(path.dirname(process.mainModule.filename)),
	ROUTE_PATH : 'routes',
	URLS       : [ '/cid', '/paciente', '/cif', '/',     '/usuario', '/dominio' ],
	ROUTES     : [ 'cid',  'paciente',  'cif',  'login', 'usuario',  'dominio'  ]
};