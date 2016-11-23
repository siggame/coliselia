FROM library/postgres:9.4
MAINTAINER siggame

ENV POSTGRES_USER ${DB_USER}
ENV POSTGRES_PASSWORD ${DB_PASS}
ENV POSTGRES_DB ${DB_DB}

ADD init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432