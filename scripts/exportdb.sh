#!/bin/sh
mongoexport --host localhost --port 27017 --db pf -c items > db.txt
