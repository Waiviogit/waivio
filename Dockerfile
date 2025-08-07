FROM node:22.18.0-alpine3.21

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./

RUN yarn install
COPY . .
RUN yarn run build $ENV

CMD yarn start
