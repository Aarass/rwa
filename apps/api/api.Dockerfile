FROM node:lts-alpine3.19

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD [ "npx", "nx", "serve", "api", "--host", "0.0.0.0"]