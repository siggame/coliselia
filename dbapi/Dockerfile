FROM library/node:6.9
MAINTAINER siggame

ADD . dbapi
WORKDIR dbapi

RUN [ -d node_modules ]

CMD ["npm", "start"]

EXPOSE 3000