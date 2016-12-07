FROM library/node:latest
MAINTAINER siggame

ADD . dbapi
WORKDIR dbapi

RUN [ -d node_modules ]
RUN [ -d bin ]


CMD ["npm", "start"]

EXPOSE 3000