FROM node:lts-alpine3.19

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

RUN apk add --no-cache bash
RUN npm install -g nodemon

CMD [ "/bin/bash", "-c", "npx nx build api; nodemon ./dist/apps/api/main.js" ]