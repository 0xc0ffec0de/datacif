#!/bin/sh
mongoimport --host localhost --port 27017 --db pf -c itens < db/cif.db
mongoimport --host localhost --port 27017 --db pf -c usuarios < db/usuarios.db
mongoimport --host localhost --port 27017 --db pf -c cid10Grupos < db/cid10grupos.db
mongoimport --host localhost --port 27017 --db pf -c cid10Itens < db/cid10itens.db
