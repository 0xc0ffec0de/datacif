#!/bin/sh
mongoexport --host localhost --port 27017 --db pf -c items > ../db/cif.db
mongoexport --host localhost --port 27017 --db pf -c usuarios > ../db/usuarios.db
mongoexport --host localhost --port 27017 --db pf -c cid10Grupos > ../db/cid10grupos.db
mongoexport --host localhost --port 27017 --db pf -c cid10Itens > ../db/cid10itens.db
mongoexport --host localhost --port 27017 --db pf -c profissoes > ../db/profissoes.db
