FROM --platform=linux/amd64 node:16-alpine AS build

WORKDIR /usr/src/app

RUN apk add git && \
    git clone --branch 'main' 'https://github.com/andrei0x309/gather-town-WS-POAP-bot.git' && \
    cd gather-town-WS-POAP-bot && \
    yarn build-all 
    

FROM --platform=linux/amd64 node:16-alpine

ENV NODE_ENV production
ENV FASTIFY_ADDRESS 0.0.0.0


RUN yarn global add pm2

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/frontend/dist/ ./frontend/dist/
COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/lib/ ./lib/
COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/backend/ ./backend/

# In case of using mongo DB you can have a docker without using a volume
# Uncomment the copy line below and make sure you have the file main.json with the necesary information 
#COPY main.json ./db/main.json

CMD pm2-runtime start /usr/src/app/backend/index.js
