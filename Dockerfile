FROM node:16-alpine

RUN mkdir -p /usr/src/client

WORKDIR /usr/src/client

RUN yarn global add @api-platform/client-generator

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json package-lock.json ./
RUN pnpm ci

COPY . ./

CMD pnpm start
 