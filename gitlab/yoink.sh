#!/bin/bash

echo "#### Select gitlab container to yoink"
names=$(docker ps --all --format "{{.Names}}")
select name in ${names}; do
    docker exec --interactive --tty ${name} cat /etc/gitlab/gitlab.rb > gitlab.rb
    break
done
