FROM node:8.11-slim

COPY ./src /src/
COPY ./package.json /package.json

RUN npm install

CMD npm run-script run

