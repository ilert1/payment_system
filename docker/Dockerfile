# build
FROM node:18.2.0-alpine as build
WORKDIR /app

ARG VITE_API_URL
ARG VITE_SUPPORT_LINK
ARG VITE_DISPUT_CHAT
ARG VITE_YMETRICS_COUNTER

COPY ./source ./

RUN npm install
RUN npm run build


# deploy
FROM nginx:1.23-alpine

RUN apk add --no-cache tzdata
ENV TZ=Europe/Moscow

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
