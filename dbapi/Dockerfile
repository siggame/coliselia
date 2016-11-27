FROM library/node:latest
MAINTAINER siggame

ADD . dbapi
WORKDIR dbapi

RUN npm install

CMD ["npm", "start"]

EXPOSE 3000