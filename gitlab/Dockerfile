FROM library/gitlab/gitlab-ce:latest
MAINTAINER siggame

VOLUME /etc/gitlab
VOLUME /var/log/gitlab
VOLUME /var/opt/gitlab

COPY restore/flash-forward.sh /tmp
ADD restore/backups.tar.gz /

RUN ["chmod", "755", "/tmp/flash-forward.sh"]
RUN ["chmod", "-R", "755", "/var/opt/gitlab/backups"]

EXPOSE 22 30 443