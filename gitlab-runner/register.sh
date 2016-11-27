#!/bin/bash

echo "#### Docker interface"
ifconfig docker0

echo "#### Select runner to register"
names=$(docker ps --all --format "{{.Names}}")
select name in ${names}; do
    docker exec --interactive --tty ${name} gitlab-runner register --executor=shell
    break
done

