FROM node:20.10-alpine3.18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
COPY . .
RUN yarn run build $ENV

CMD yarn start
