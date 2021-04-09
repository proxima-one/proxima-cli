FROM node:12
WORKDIR /app
COPY package*.json ./
#Run yarn add
RUN npm install
#Run the typescript update
RUN npm tsc
COPY . .
CMD [ "npm", "start" ]
