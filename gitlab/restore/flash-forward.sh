#!/bin/bash

echo "Attempting to restore most recent backup..."

recent=$(ls /var/opt/gitlab/backups | tail -1 | sed "s/_gitlab_backup.tar//g")

gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq

echo "Restoring backup $recent to container..."

BACKUP="$recent" && printf "yes\nyes\n" | \
gitlab-rake gitlab:backup:restore

gitlab-ctl start &

exit 0
