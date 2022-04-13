FROM --platform=linux/amd64 node:16-alpine AS build

WORKDIR /usr/src/app

RUN apk add git && \
    git clone --branch 'dev-v2' 'https://github.com/andrei0x309/gather-town-WS-POAP-bot.git' && \
    cd gather-town-WS-POAP-bot && \
    yarn build-all

FROM --platform=linux/amd64 node:16-alpine

ENV NODE_ENV production

RUN yarn global add pm2

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/frontend/dist/ ./frontent/dist/
COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/lib/ ./lib/
COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/backend/ ./backend/

CMD pm2-runtime start /usr/src/app/backend/index.js
