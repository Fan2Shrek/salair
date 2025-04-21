ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS main

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

EXPOSE 3333

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

FROM main AS builder

RUN npm run build

FROM node:${NODE_VERSION}-alpine AS prod

WORKDIR /app

COPY --from=builder /app/build/ /app/

RUN npm ci --omit=dev

CMD [ "node", "bin/server.js" ]