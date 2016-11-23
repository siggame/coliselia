#!/bin/bash

docker stop gitlab
docker rm --force gitlab

docker run --detach \
    --hostname gitlab.example.com \
    --publish 443:443 --publish 80:80 --publish 22:22 \
    --name gitlab \
    --volume gitlab_vol:/\
    gitlab/gitlab-ce:latest