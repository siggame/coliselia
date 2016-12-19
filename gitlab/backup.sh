#!/bin/bash

echo "Backing up gitlab state..."

UP=$(cd .. && pwd)

docker-compose --file $UP/docker-compose.yml \
               exec gitlab \
               gitlab-rake gitlab:backup:create

docker run --rm --volumes-from coliselia_gitlab_1 \
       -v $(pwd):/backup busybox \
       tar czvf /backup/backups.tar.gz var/opt/gitlab/backups

tar xzvf backups.tar.gz && mv var temp
mv temp/opt/gitlab/backups/* backup
rm -r temp


