
FROM node:alpine

WORKDIR /app/

RUN apk update && apk add yarn bash python g++ make && rm -rf /var/cache/apk/*

COPY ./package.json /app/

RUN npm install

COPY ./ /app/

RUN npm rebuild

EXPOSE 4000

CMD ["npm", "start"]
