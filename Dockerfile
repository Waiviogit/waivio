FROM node:18.12.0-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./

RUN yarn install
COPY . .
RUN yarn run build $ENV

CMD yarn start
