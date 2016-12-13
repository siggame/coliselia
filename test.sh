#!/bin/bash

YML=${1:-'docker-compose.yml'}
echo "Using ${YML}"

docker-compose --file ${YML} stop
docker-compose --file ${YML} build
docker-compose --file ${YML} up -d

if ! docker-compose --file ${YML} exec dbapi npm test; then
    docker-compose --file ${YML} stop
    exit 1
fi

docker-compose --file ${YML} stop
