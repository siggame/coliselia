FROM library/ubuntu:latest
MAINTAINER siggame

RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash

ADD . dbapi
WORKDIR dbapi

RUN nvm install
RUN npm install

CMD [npm, start]

EXPOSE 3000