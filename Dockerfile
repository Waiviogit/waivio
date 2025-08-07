FROM node:20.19-alpine3.21

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG ENV

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build $ENV

CMD yarn start
