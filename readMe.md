# YUP GATHER BOT V2 - WITH POAP SUPPORT

## Local setup

- clone repo
- run `yarn install`
- run yarn build-all
- `cd backend` && `yarn start`
APP will listen on `ENV:PORT` if ENV PORT is not set, it will default to 4552

## Docker setup

  If you want to run wiithout persistent storage, you need to create a main.json file alongisde the Dockerfile.
  This mode is supported only under `mongodb` dbType and not `file` engine which requires persistent storage.

 `main.json` file should look like this:

 ```json
{
    "email": "any@email.com",
    "password": "plain-text-password",
    "gatherSpace": "gather-space-name",
    "apiKey": "gather-api-key",
    "backendHostname": "https://gather-bot.yourdomain.com",
    "polygonScanApiKey": "your-api-key",
    "dbType": "mongodb",
    "dbConnectionString": "mongodb+srv://url...."
}
```

Then uncomment the COPY directive in the Dockerfile and `docker build -t gather-bot:latest .`

### Current features

From admin panel you can: add authorized users, add poap links to send, add teleport locations, tokengate teleport locations, connect or discconnect the bot.

Chat commands that the bot will respond:

Authorized users:

- `/bot send-poap` - send poap to all users present onserver that are logged in
- `/bot poap-new-users` - send poap to new users that that connected later than when you issued `/bot send-poap`
- `/bot teleport-to-me` - teleports the bot at the command issuer location
- `/bot disconnect` - disconnects the bot
- `/bot teleport <teleportName>` - teleports the issuer to the teleport location with the name &lt;teleportName&gt; that was added with the admin pannel
- `/bot teleport <teleportName> <targetPlayer>` - same as above but teleports the &lt;targetPlayer&gt; to the teleport location with the name &lt;teleportName&gt; instead of the issuer, &lt;targetPlayer&gt; in this case is the name of a user connected to gather
- `/bot get-id <targetPlayer>` - returns the id of the &lt;targetPlayer&gt;
- `/bot yup-balance` - returns the balance of YUP polygon token of the issuer
- `/bot help` - returns iformation about the bot commands

Basic commands(avaiable for all users):

- `/bot help` - returns iformation about the bot commands for basic commands
- `/bot get-coords` - returns the current location coords and map of command issuer
- `bot link-eth` - returns an url to link issuer's ETH address to the gather account
- `/bot relink-eth` - returns a link for chainging the issuer's linked ETH address
- `/bot my-eth` - returns the issuer's linked ETH address
- `/bot list-evnets` - returns a list of tokengated events available
- `/bot join <eventName>` - joins the issuer to the tokengated event with the name &lt;eventName&gt; if he passes the event's token ammount restriction
- `/bot my-id` - returns the issuer's id

### Notes

V1 is deprecated but you can find it here on this branch: <https://github.com/andrei0x309/gather-town-WS-POAP-bot/tree/old-v1>
