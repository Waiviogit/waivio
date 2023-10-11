FROM node:20.8-alpine3.18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./

RUN yarn install
COPY . .
RUN yarn run build $ENV

CMD yarn start
