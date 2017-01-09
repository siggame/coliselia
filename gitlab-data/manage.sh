#!/bin/bash

case $@ in
base)
    echo "$0 base {init|export|rm|help}"
    ;;
base\ init)
    echo "Initializing new base GitLab..."
    docker stop base-gitlab
    docker rm --force base-gitlab
    docker rmi --force base-gitlab-image
    docker build --tag base-gitlab-image ../gitlab/
    docker run \
        --publish 8081:80 \
        --detach --name base-gitlab \
         base-gitlab-image
    ;;
base\ export)
    echo "Stopping base GitLab container..."
    docker stop base-gitlab

    echo "Exporting volumes..."
    docker run --rm --volumes-from base-gitlab \
        --volume $(pwd):/coliselia busybox \
        tar cvf /coliselia/data.tar /etc/gitlab /var/log/gitlab /var/opt/gitlab

    echo "Restarting base GitLab container..."
    docker start base-gitlab
    ;;
base\ rm)
    echo "Stopping and removing base GitLab image..."
    docker stop base-gitlab
    docker rm --force base-gitlab
    docker rmi --force base-gitlab-image
    ;;

base\ help)
    echo "$0 base init   - Initialize and run new base GitLab image and container"
    echo "$0 base export - Export base GitLab image data"
    echo "$0 base rm     - Stop and remove base GitLab image and container"
    echo "$0 base help   - Show this help information"
    ;;

data)
    echo "$0 data {export|import|help}"
    ;;
data\ export)
    echo "Export GitLab data to tar..."
    docker run --rm --volumes-from gitlab-data \
        --volume $(pwd):/coliselia busybox \
        tar cvf /coliselia/data.tar \
        /etc/gitlab /var/log/gitlab /var/opt/gitlab
    ;;
data\ import)
    echo "Removing previous GitLab data image and container..."
    docker stop gitlab-data
    docker rm --force gitlab-data
    docker rmi --force gitlab-data-image

    echo "Build and run empty GitLab data image and container..."
    docker build --tag gitlab-data-image .
    docker run \
        --detach --name gitlab-data \
         gitlab-data-image

    echo "Stop GitLab data container..."
    docker stop gitlab-data

    echo "Extract tar data into respective volumes..."
    docker run --rm --volumes-from gitlab-data --volume $(pwd):/coliselia busybox\
        tar xvf /coliselia/data.tar -C /

    echo "Restart GitLab data container..."
    docker start gitlab-data
    ;;
data\ help)
    echo "$0 data export - Save tar files from GitLab data image"
    echo "$0 data import - Create a GitLab data image and container from local tar files"
    echo "$0 data help   - Display this message"
    ;;

test)
    echo "$0 test {init|rm|help}"
    ;;
test\ init)
    echo "Initialize and start test GitLab..."
    docker stop test-gitlab
    docker rm --force test-gitlab
    docker rmi --force test-gitlab-image
    docker build --tag test-gitlab-image ../gitlab/
    docker run \
        --publish 8082:80 \
        --volumes-from gitlab-data \
        --detach --name test-gitlab \
         test-gitlab-image
    ;;
test\ rm)
    echo "Stop and remove test GitLab..."
    docker stop test-gitlab
    docker rm --force test-gitlab
    docker rmi --force test-gitlab-image
    ;;
test\ help)
    echo "$0 test init - Create and start test GitLab container using volumes from GitLab data"
    echo "$0 test rm   - Stop and destroy test GitLab container"
    echo "$0 test help - Display this message"
    ;;

help|-h|--help)
    echo "$0 base - Manage a base GitLab image/container to create export data"
    echo "$0 data - Manage a base GitLab data image/container"
    echo "$0 help - Display this message"
    ;;
*)
    echo "$0 {base|data|help}"
    ;;
esac