# STAGE 1
FROM node:16 as builder

RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app

WORKDIR /usr/app

COPY package.json ./
# RUN npm config set unsafe-perm true

RUN npm install -g typescript
RUN npm install -g ts-node

USER node

COPY --chown=node:node . .

RUN npm run build

# STAGE 2
FROM node:16

RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app

WORKDIR /usr/app

COPY package.json ./

USER node

RUN npm install

COPY --from=builder /usr/app/dist ./build

# COPY --chown=node:node .env .

EXPOSE 8000

CMD [ "node", "build/server.js" ]