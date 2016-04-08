#!/bin/sh
OLD_DIR=$PWD
NEW_DIR=`dirname $0`
cd $NEW_DIR
mongoexport --host 127.0.0.1 --port 27017 --db pf -c itens > ../db/cif.db
mongoexport --host 127.0.0.1 --port 27017 --db pf -c usuarios > ../db/usuarios.db
mongoexport --host 127.0.0.1 --port 27017 --db pf -c cid10Grupos > ../db/cid10grupos.db
mongoexport --host 127.0.0.1 --port 27017 --db pf -c cid10Itens > ../db/cid10itens.db
mongoexport --host 127.0.0.1 --port 27017 --db pf -c profissoes > ../db/profissoes.db
mongoexport --host 127.0.0.1 --port 27017 --db pf -c telas > ../db/telas.db
mongoexport --host 127.0.0.1 --port 27017 --db pf -c pacientes > ../db/pacientes.db
cd $OLD_DIR
