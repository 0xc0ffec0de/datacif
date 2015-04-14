#!/bin/sh
mongoimport --host localhost --port 27017 --db pf -c items < db/cif.db
mongoimport --host localhost --port 27017 --db pf -c users < db/users.db
