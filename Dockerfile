FROM node:12-alpine
RUN mkdir -p /usr/src/app
RUN apk add vim
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 7809
WORKDIR /usr/src/app
CMD [ "npm", "start" ]
