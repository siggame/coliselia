#!/bin/bash

PORT=$(node -p "require('config').database.port")
USER=$(node -p "require('config').database.user")
PASS=$(node -p "require('config').database.pass")
DB=$(node -p "require('config').database.db")

echo "#### Setting up coliselia database..."
echo "## Using user ${USER}"
echo "## Using pass ${PASS}"
echo "## Using db ${DB}"
echo "## Using port ${PORT}"
docker stop coliselia_db
docker rm --force coliselia_db
docker rmi --force coliselia_db_image

docker build -f ./db.dockerfile -t coliselia_db_image --build-arg USER=${USER} --build-arg PASS=${PASS} --build-arg DB=${DB} .
docker run --name coliselia_db -d -p ${PORT}:5432 coliselia_db_image

docker start coliselia_db
echo "#### Set up coliselia database"
