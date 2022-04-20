FROM --platform=linux/amd64 node:16-alpine AS build

WORKDIR /usr/src/app

# this makes sense only if you use dbtype mongobd for file you need a docker volume
# Uncomment line bellow and replace values if you want to include the main file so you won't need a stateful docker 
ENV MAIN_FILE '{\\n\\t\\n"email": "andrei@flashsoft.eu",\\t\\n"password": "pass12345",\\t\\n"gatherSpace": "Q4lhVFn3ZNMNCGMD/space-name",\\t\\n"apiKey": "13R333bsjX8pZ",\\t\\n"backendHostname": "https://gatherbot.domain.example",\\t\\n"polygonScanApiKey": "23423423",\\t\\n"dbType": "mongodb",\\t\\n"dbConnectionString": "mongodb+srv://user:324JJJ@appdbmongo.pcrig.mongodb.net/db?retryWrites=true&w=majority"\\t\\n}\\n'

RUN apk add git && \
    git clone --branch 'dev-v2' 'https://github.com/andrei0x309/gather-town-WS-POAP-bot.git' && \
    cd gather-town-WS-POAP-bot && \
    yarn build-all && \
    `if [ -z ${MAIN_FILE+x} ];then echo "MAIN_FILE env not set"; else echo "$MAIN_FILE" > main.json  fi`

FROM --platform=linux/amd64 node:16-alpine

ENV NODE_ENV production
ENV FASTIFY_ADDRESS 0.0.0.0


RUN yarn global add pm2

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/frontend/dist/ ./frontend/dist/
COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/lib/ ./lib/
COPY --from=build /usr/src/app/gather-town-WS-POAP-bot/backend/ ./backend/
COPY --from=build /usr/src/app/main.json ./db/main.json

CMD pm2-runtime start /usr/src/app/backend/index.js
