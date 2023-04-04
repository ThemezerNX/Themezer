FROM node:12 AS build-env

WORKDIR /usr/src/app

# Environment variables for production
ENV NODE_ENV=production

ENV ENDPOINT=https://themezer.net/
ENV API_ENDPOINT=https://api.themezer.net/

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install

COPY . .

RUN yarn run build

# Prune the dev dependencies
RUN yarn install --production

CMD yarn run start
