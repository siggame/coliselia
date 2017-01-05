#!/bin/bash

# Copies the /etc/gitlab/gitlab.rb file from a running container

echo "#### Select gitlab container to yoink"
names=$(docker ps --all --format "{{.Names}}")
select name in ${names}; do
    docker exec --interactive --tty ${name} cat /etc/gitlab/gitlab.rb > gitlab.rb
    break
done
