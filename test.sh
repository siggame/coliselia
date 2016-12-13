#!/bin/bash

YML=${1:-'docker-compose.yml'}
echo "Using ${YML}"

docker-compose --file ${YML} stop
docker-compose --file ${YML} build
docker-compose --file ${YML} up -d

while ! docker-compose --file ${YML} exec db psql \
    coliselia --username=postgres -c 'SELECT 1'; do
  echo 'Waiting for postgres...'
  sleep 1;
done;

if ! docker-compose --file ${YML} exec dbapi npm test; then
    docker-compose --file ${YML} stop
    exit 1
fi

docker-compose --file ${YML} stop
