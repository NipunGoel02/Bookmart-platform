#Sample Dockerfile for NodeJS Apps

FROM node:23.1.0

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 7000

CMD [ "node", "main.js" ]