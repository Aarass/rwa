FROM node:lts-alpine3.19

WORKDIR /usr/src/client

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD [ "npx", "nx", "serve", "client", "--host", "0.0.0.0" ]