FROM node:12

WORKDIR /servergosh

COPY package.json /servergosh/package.json

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]