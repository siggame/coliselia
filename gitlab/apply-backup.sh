#!/bin/bash

UP=$(cd .. && pwd)
backups=$(ls backup)

echo "#### Select gitlab backup to apply"

select backup in ${backups}; do
  to_apply=$(echo "$backup" | sed 's/_gitlab_backup.tar//g')
  echo "Applying backup $to_apply..."

  docker exec coliselia_gitlab_1 gitlab-rake gitlab:check SANITIZE=true
  docker cp "backup/$backup" coliselia_gitlab_1:/var/opt/gitlab/backups
  docker exec coliselia_gitlab_1 gitlab-ctl stop unicorn
  docker exec coliselia_gitlab_1 gitlab-ctl stop sidekiq
  docker exec coliselia_gitlab_1 chmod -R 755 /var/opt/gitlab/backups
  docker exec -t coliselia_gitlab_1 bash -c 'BACKUP="$to_apply" && printf "yes\nyes\n" | gitlab-rake gitlab:backup:restore'
  docker exec coliselia_gitlab_1 gitlab-ctl start  
  docker exec coliselia_gitlab_1 gitlab-rake gitlab:check SANITIZE=true
  break
done




