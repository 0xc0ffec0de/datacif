#!/bin/sh
#
mongod --dbpath ./data --port 27018 --smallfiles &
DEBUG=my-application ./bin/www
