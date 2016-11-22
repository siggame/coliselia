FROM library/postgres:9.4

ARG USER
ARG PASS
ARG DB

RUN echo "USER: ${USER}"
RUN echo "PASS: ${PASS}"
RUN echo "DB: ${DB}"

ENV POSTGRES_USER ${USER}
ENV POSTGRES_PASSWORD ${PASS}
ENV POSTGRES_DB ${DB}

ADD init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432