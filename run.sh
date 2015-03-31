#!/bin/sh
#
mongod --dbpath ./data --port 27017 --smallfiles &
DEBUG=my-application ./bin/www
