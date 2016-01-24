#!/bin/sh
OLD_DIR=$PWD
NEW_DIR=`dirname $0`
cd $NEW_DIR

#mongoimport --jsonArray --host 127.0.0.1 --port 27017 --db pf -c itens < ../db/cif.db # (Linux)
mongoimport --host 127.0.0.1 --port 27017 --db pf -c itens < ../db/cif.db

mongoimport --host 127.0.0.1 --port 27017 --db pf -c usuarios < ../db/usuarios.db
mongoimport --host 127.0.0.1 --port 27017 --db pf -c cid10Grupos < ../db/cid10grupos.db
mongoimport --host 127.0.0.1 --port 27017 --db pf -c cid10Itens < ../db/cid10itens.db
mongoimport --host 127.0.0.1 --port 27017 --db pf -c profissoes < ../db/profissoes.db
mongoimport --host 127.0.0.1 --port 27017 --db pf -c telas < ../db/telas.db
mongoimport --host 127.0.0.1 --port 27017 --db pf -c titulos < ../db/titulos.db
cd $OLD_DIR
