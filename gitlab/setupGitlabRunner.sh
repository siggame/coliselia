#!/bin/bash

docker stop gitlab-runner
docker rm -f gitlab-runner

docker run --detach \
    --name gitlab-runner \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume gitlab_runner_config:/etc/gitlab-runner \
    gitlab/gitlab-runner:latest

default_url=$(ip addr show docker0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1)
echo "Go to http://localhost/admin/runners to get your gitlab-ci token"
docker exec --interactive --tty gitlab-runner gitlab-runner register \
    --name runner1 \
    --url "http://$default_url/ci" \
    --tags mmai \
    --executor docker