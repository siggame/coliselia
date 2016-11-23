#!/bin/bash

docker build -t coliselia_db_image .
docker run --name coliselia_db -d -p ${PORT}:5432 coliselia_db_image
docker start coliselia_db
