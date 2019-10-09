FROM node:alpine

COPY ./ ./

RUN npm install

EXPOSE 80

CMD ["node", "server.js"]