FROM node:18 AS builder

WORKDIR /app

RUN apt-get update \
    && npm install express \
    && npm install mysql

RUN wget https://github.com/jwilder/dockerize/releases/download/v0.3.0/dockerize-linux-amd64-v0.3.0.tar.gz \
    && tar -xzvf dockerize-linux-amd64-v0.3.0.tar.gz \
    && rm -r dockerize-linux-amd64-v0.3.0.tar.gz

COPY . .

FROM alpine

WORKDIR /app

COPY --from=builder /app /app 

RUN apk update && apk upgrade && \
    apk add nodejs npm

RUN mv /app/dockerize /usr/local/bin/dockerize

EXPOSE 3000