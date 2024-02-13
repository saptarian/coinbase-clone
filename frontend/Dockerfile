FROM node:20.11.0-bookworm-slim AS assets
LABEL maintainer="Sapta Rianza <saptaqur@gmail.com>"

WORKDIR /app/frontend

ARG UID=1000
ARG GID=1000

RUN \
  --mount=type=cache,target=/var/cache/apt apt-get update \
  && apt-get install -y --no-install-recommends build-essential

RUN pwd && whoami \
  && rm -rf /usr/share/doc /usr/share/man \
  && groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node \
  && mkdir -p /node_modules && chown node:node -R /node_modules /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

ARG NODE_ENV="production"
ENV NODE_ENV="${NODE_ENV}" \
    PATH="${PATH}:/node_modules/.bin" \
    VITE_API_BACKEND_SERVER="http://localhost:8000" \
    VITE_LOGO_BASE_URL="https://s2.coinmarketcap.com/static/img/coins/64x64" \
    USER="node"

COPY --chown=node:node . .

RUN npm run build --omit=dev

FROM nginx:1.25.3-alpine

WORKDIR /var/www/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY --from=assets /app/frontend/dist/ .
