FROM node:16.16.0
WORKDIR /server
COPY ./api_server /server
CMD [ "node", "/server/app.js" ]