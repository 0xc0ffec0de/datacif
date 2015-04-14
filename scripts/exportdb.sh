#!/bin/sh
mongoexport --host localhost --port 27017 --db pf -c items > db/cif.db
mongoexport --host localhost --port 27017 --db pf -c users > db/users.db
