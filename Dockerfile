FROM node:22.12-alpine

WORKDIR /usr/src/app

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "run", "start:dev" ]