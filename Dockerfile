FROM node:16.13-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./

RUN yarn install
COPY . .
RUN yarn run build $ENV

CMD yarn start
