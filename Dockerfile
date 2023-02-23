

# ref: https://medium.com/codex/dockerize-angular-application-69e7503d1816

# docker build -t a40insurance:feb23e .

# docker run -tp 80:80 a40insurance:feb23e



#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install 

EXPOSE  8000

#stage 2
FROM nginx:alpine
COPY --from=node /app  /usr/share/nginx/html