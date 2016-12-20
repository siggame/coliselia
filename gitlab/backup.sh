#!/bin/bash -e

echo "Backing up gitlab state..."

UP=$(cd .. && pwd)

echo "Performing backup on container..."

docker-compose --file $UP/docker-compose.yml \
               exec gitlab \
               gitlab-rake gitlab:backup:create

echo "Writing backups to restore directory..."

docker run --rm --volumes-from coliselia_gitlab_1 \
       -v $(pwd)/restore:/backup busybox \
       tar czvf /backup/backups.tar.gz var/opt/gitlab/backups
