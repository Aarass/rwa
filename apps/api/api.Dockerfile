FROM node:lts-alpine3.19

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

RUN npx nx reset
RUN npx nx build api
RUN npx nx reset

CMD [ "npx", "nx", "serve", "api", "--host", "0.0.0.0"]
# CMD ["sh", "-c", "npx nx reset && npx nx build api && npx nx serve api --host 0.0.0.0"]

