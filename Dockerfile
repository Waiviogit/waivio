FROM node:18.12.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./

RUN yarn install
COPY . .
RUN yarn run buildClient $ENV

CMD yarn startSsr
