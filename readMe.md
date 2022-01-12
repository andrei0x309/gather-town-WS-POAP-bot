#YUP POAP GATHER BOT

Bot used to send POAP links:

Usage:
- create a .env file, configure the `GATHER_SPACE` and `GATHER_API_KEY` vars
- put links in currentLINKS.db (one link per line )
- add authorized users that can sent commands to the bot `this.authorizedUsers` array 
- run `yarn install`
- run node bot

_If user is not authorized, the bot will respond with a message that the user is not authorized_

Current commands chat commants for bot are:
- `/bot disconnect` to disconnect the bot
- `/bot send-poap` sends POAP links to the connected users on the Gather Space
- `/bot poap-new-users` sends POAP to new users that have joined the Gather Space
- `/bot teleport-to-me` teleports the bot-charcater to the user that sent the command 