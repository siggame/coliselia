#!/bin/bash

docker-compose stop
docker-compose build
docker-compose up -d

docker-compose exec dbapi npm test

docker-compose stop
