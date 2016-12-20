FROM library/gitlab/gitlab-ce:latest
MAINTAINER siggame

VOLUME /etc/gitlab
VOLUME /var/log/gitlab
VOLUME /var/opt/gitlab

COPY restore/flash-forward.sh /etc/gitlab
ADD restore/backups /var/opt/gitlab/backups

RUN ["chmod", "-R", "755", "/var/opt/gitlab/backups"]

EXPOSE 22 30 443