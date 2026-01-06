FROM node:24.12.0-alpine3.23

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build $ENV

CMD yarn start
