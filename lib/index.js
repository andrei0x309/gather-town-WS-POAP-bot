import dotenv from 'dotenv'
import { Game } from '@gathertown/gather-game-client'
import webSocket from 'isomorphic-ws'
import SimpleNodeLogger from 'simple-node-logger'
import path from 'path'
import fs from 'fs'
import Conf from 'conf'
import fetch from 'node-fetch'
import { utils } from 'ethers'

import { mainSchema } from './schemas/main.js'
import { poapLinksSchema } from './schemas/poap-links.js'
import { settingsSchema } from './schemas/settings.js'
import { teleportSchema } from './schemas/teleport.js'
import { ethChallengeSchema } from './schemas/eth-challenge.js'
import { ethLinksSchema } from './schemas/eth-links.js'

dotenv.config()

// const API_KEY = process.env.GATHER_API_KEY
// const GATHER_SPACE = process.env.GATHER_SPACE

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs')
}

// const currentClaimLinks = fs.readFileSync('currentLINKS.db', 'utf8')
// const usedClaimLinks = fs.readFileSync('usedLINKS.db', 'utf8')

// const linkPattern = /https?:\/\/.*?( |\n)/gms
// const currentClaimLinksArr = currentClaimLinks.match(linkPattern)
//   ? [...currentClaimLinks.match(linkPattern)].map((link) => link.slice(0, -1))
//   : []
// let usedClaimLinksArr = usedClaimLinks.match(linkPattern) ? [...usedClaimLinks.match(linkPattern)].map((link) => link.slice(0, -1)) : []
// let memClaimLinksArr = currentClaimLinksArr.filter((link) => !usedClaimLinksArr.includes(link))
// let memUsedClaimLinksArr = []

// const flushUsedClaimLinks = () => {
//   memUsedClaimLinksArr = [...usedClaimLinksArr, ...memUsedClaimLinksArr]
//   fs.writeFileSync('usedLINKS.db', memUsedClaimLinksArr.join('\n'), {
//     encoding: 'utf8',
//     flag: 'w+'
//   })
//   memUsedClaimLinksArr = []
//   const usedClaimLinks = fs.readFileSync('usedLINKS.db', 'utf8')
//   usedClaimLinksArr = usedClaimLinks.match(linkPattern) ? [...usedClaimLinks.match(linkPattern)].map((link) => link.slice(0, -1)) : []
//   memClaimLinksArr = currentClaimLinksArr.filter((link) => !usedClaimLinksArr.includes(link))
// }

function createLogger(enableConsole, opts) {
  // opts is the normal opts you'd pass in like logFilePath or timestampFormat
  const manager = new SimpleNodeLogger(opts)
  if (enableConsole) {
    manager.createConsoleAppender(opts)
  }
  if (opts.logFilePath) {
    manager.createFileAppender(opts)
  }
  return manager.createLogger()
}

const fileName = new Date().toISOString().replace(/T/, ' ').replace(/:/g, '-').replace(/\..+/, '')

const logger = createLogger(false, {
  logFilePath: path.join(path.resolve(), `logs/${fileName}.log`),
  timestampFormat: 'YY-MM-DD HH:mm:ss.SSS'
})

let dupeConnecting = false

export class GatherPOAPBot {
  constructor(DBLocation) {
    global.WebSocket = webSocket
    this.mainStore = new Conf({ configName: 'main', schema: mainSchema, cwd: DBLocation })
    this.teleportStore = new Conf({ configName: 'teleport', schema: teleportSchema, cwd: DBLocation })
    this.poapLinksStore = new Conf({ configName: 'poap-links', schema: poapLinksSchema, cwd: DBLocation })
    this.settingsStore = new Conf({ configName: 'settings', schema: settingsSchema, cwd: DBLocation })
    this.ethChallengeStore = new Conf({ configName: 'eth-challenge', schema: ethChallengeSchema, cwd: DBLocation })
    this.ethLinksStore = new Conf({ configName: 'eth-links', schema: ethLinksSchema, cwd: DBLocation })
    this.backendApi = this.mainStore.get('backendHostname', '')
    this.authorizedUsers = this.settingsStore.get('authUsers', [])
    this.lastLinkedUsers = this.ethLinksStore.get('users', [])
    console.log(DBLocation)
    this.connected = false
    this.botId = 'w9TPUKsBkOOasECrD4yaSxefkir1'
    this.enteredSpace = false
    this.usersPOAPSent = []
    // this.authorizedUsers = ['fW6l5sr0czZrXOpZQ5vvaslqOuQ2']
    this.space = this.mainStore.get('gatherSpace', null)
    this.debugLog = true
    this.game = new Game(() => Promise.resolve({ apiKey: this.mainStore.get('apiKey') }))
    if (this.settingsStore.get('autoConnect', false)) {
      this.gatherConnect()
    }
  }

  async getPolyTokenBalance(address, tokenContract) {
    const url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${tokenContract}&address=${address}&tag=latest&apikey=${this.mainStore.get(
      'polygonScanApiKey'
    )}`
    const req = await fetch(url)
    if (!req.ok) {
      return 0
    }
    const json = await req.json()
    try {
      return Number(utils.formatEther(json.result))
    } catch (e) {
      return 0
      console.log(e)
    }
  }

  gatherConnect() {
    if (!dupeConnecting) {
      dupeConnecting = true
      setTimeout(() => {
        dupeConnecting = false
      }, 5000)
    } else {
      return
    }
    if (!this.space) {
      this.space = this.mainStore.get('gatherSpace', null)
      if (!this.space) {
        console.log('No space set')
      }
    }
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Connecting to Gather Space...', this.space)
        await this.game.connect(this.space)
        this.game.subscribeToConnection(this.onConnected.bind(this))
        this.game.subscribeToEvent('playerJoins', (player) => {
          if (this.debugLog) console.log('Player Joins Event:', player)
          resolve()
        })
        this.game.subscribeToEvent('playerChats', this.onCheckCommand.bind(this))
      } catch (e) {
        console.log(e)
      }
    })
  }

  checkUserIsLinked(user, reloadFile = true) {
    if (reloadFile) {
      this.lastLinkedUsers = this.ethLinksStore.get('users', [])
    }
    return this.lastLinkedUsers.find((u) => u.user === user.id)
  }

  gatherDisconnect() {
    this.game.flushObjectsToFirebase()
    this.game.exit(this.space)
    this.game.disconnect(this.space)
    global.WebSocket = null
    this.game = null
  }

  reloadSettings() {
    this.authorizedUsers = this.settingsStore.get('authUsers')
  }

  reloadMainStore() {
    this.backendApi = this.mainStore.get('backendHostname', null)
    this.space = this.mainStore.get('gatherSpace', null)
  }

  isConnected() {
    return this.game.connected
  }

  async onCheckCommand(msg, context) {
    if (msg.playerChats.contents.startsWith('/bot')) {
      const user = this.game.players[msg.playerChats.senderId]
      user.id = msg.playerChats.senderId
      const botMsg = msg.playerChats.contents.split('/bot')[1].trim().split(' ')
      const command = botMsg[0]
      const args = botMsg.slice(1) || []
      const unkownMsg = '⚠️ Command not found see /bot help for a list of commands'
      const basicCommands = ['join', 'list-events', 'link-eth', 'relink-eth', 'my-eth', 'get-coords', 'my-id']
      const unauthorizedCmds = `💬 Commands availabe for your auth level: \n /bot ${basicCommands[0]} <event> \n /bot ${basicCommands[0]} \n /bot ${basicCommands[1]} \n /bot ${basicCommands[2]} \n /bot ${basicCommands[3]} \n /bot ${basicCommands[4]} /bot my-id`
      const isAuthorized = this.authorizedUsers.includes(msg.playerChats.senderId)
      if (isAuthorized) {
        switch (command) {
          case 'send-poap':
            if (this.usersPOAPSent.length > 0) {
              this.game.chat(`${user.id}`, [], user.map, 'POAP ALREADY SENT USE: /bot poap-new-users')
            } else {
              this.sendPoapToUsers()
            }
            break
          case 'poap-new-users':
            this.sendPoapToUsers(true)
            break
          case 'teleport-to-me':
            this.game.teleport(user.map, user.x + 1, user.y)
            break
          case 'disconnect':
            this.gatherDisconnect()
            break
          case 'teleport': {
            const location = args[0]
            let target = args[1]
            if (!location) {
              this.game.chat(`${user.id}`, [], user.map, '⚠️ Please add location to teleport to eg: /bot teleport <location> <target?>')
              break
            }
            let targetId
            if (target) {
              if (target.startsWith('"') || target.startsWith("'")) {
                for (let i = 2; i < args.length; i++) {
                  target += ' ' + args[i]
                  if (args[i].includes('"') || args[i].includes("'")) {
                    break
                  }
                }
                target = target.replace(/('|")/g, '')
              }
              console.log(target)
              const targetPlayer = this.getUsers().find((p) => p.name.toLowerCase() === target.toLowerCase())
              targetId = targetPlayer && targetPlayer.id
              if (!targetId) {
                this.game.chat(`${user.id}`, [], user.map, '⚠️ Target user to not found')
                break
              }
            }
            const teleports = this.teleportStore.get('teleports', [])
            if (!teleports.length) {
              this.game.chat(`${user.id}`, [], user.map, '⚠️ No teleport locations found, please add some from admin panel')
              break
            }
            const teleport = teleports.find((t) => t.teleportName === location)
            if (!teleport) {
              this.game.chat(`${user.id}`, [], user.map, '⚠️ Location by teleportName not found')
              break
            }
            if (targetId) {
              this.game.teleport(teleport.map, teleport.x, teleport.y, targetId)
            } else {
              this.game.teleport(teleport.map, teleport.x, teleport.y, user.id)
            }
            break
          }
          case 'yup-balance': {
            const checkEthUser = this.checkUserIsLinked(user)
            if (!checkEthUser) {
              this.game.chat(`${user.id}`, [], user.map, '⛔ You are not linked to your Ethereum account, link before checking balance')
              break
            }
            const yupBalance = await this.getPolyTokenBalance(checkEthUser.address, '0x086373fad3447F7F86252fb59d56107e9E0FaaFa')
            this.game.chat(`${user.id}`, [], user.map, `💰 Your YUP balance is: ${yupBalance}`)
            break
          }
          case 'help':
            this.game.chat(
              `${user.id}`,
              [],
              user.map,
              '💬 Commands for authorized users: \n /bot send-poap, \n /bot poap-new-users, \n /bot teleport-to-me, \n /bot disconnect \n /bot teleport <place> \n /bot teleport <place> <user-name> \n /bot yup-balance \n\n plus all comands for un-authorized users: see them with \n /bot help-unauthorized'
            )
            break
          case 'get-id':
            let target = args[0]
            let targetId
            if (target) {
              if (target.startsWith('"') || target.startsWith("'")) {
                for (let i = 2; i < args.length; i++) {
                  target += ' ' + args[i]
                  if (args[i].includes('"') || args[i].includes("'")) {
                    break
                  }
                }
                target = target.replace(/('|")/g, '')
              }
            }
            const targetPlayer = this.getUsers().find((p) => p.name.toLowerCase() === target.toLowerCase())
            targetId = targetPlayer && targetPlayer.id
            if (!targetId) {
              this.game.chat(`${user.id}`, [], user.map, '⚠️ Target user to not found')
              break
            }
            this.game.chat(`${user.id}`, [], user.map, `💬 Target user ID is ${targetId}`)
            break
          case 'help-unauthorized':
            this.game.chat(`${user.id}`, [], user.map, `💬 Commands for all users: ${unauthorizedCmds.split('level:')[1]}`)
            break
          default:
            if (!basicCommands.includes(command)) {
              this.game.chat(`${user.id}`, [], user.map, unkownMsg)
            }
        }
      }
      switch (command) {
        case 'help':
          if (!isAuthorized) {
            this.game.chat(`${user.id}`, [], user.map, unauthorizedCmds)
          }
          break
        case 'get-coords':
          this.game.chat(`${user.id}`, [], user.map, `💬 Your location in this space: [ Map: ${user.map} X: ${user.x} , Y: ${user.y} ]`)
          break
        case 'link-eth':
          if (this.checkUserIsLinked(user)) {
            this.game.chat(`${user.id}`, [], user.map, '💬 Your account already has an eth attached use /bot relink-eth to change it')
            break
          }
        case 'relink-eth':
          if (!user.isSignedIn) {
            this.game.chat(`${user.id}`, [], user.map, '⛔ You need to sign in into gather berfore link/relink your eth')
            break
          }
          const code = (Math.random() + 1).toString(36).substring(2)
          const challenges = this.ethChallengeStore.get('challenges', [])
          const expire = new Date().getTime() + 1000 * 60 * 15
          challenges.push({
            code,
            user: user.id,
            message: `✍️ Please sign to this message link your ethereum address: [${code}]`,
            expire
          })
          this.ethChallengeStore.set('challenges', challenges)
          this.game.chat(
            `${user.id}`,
            [],
            user.map,
            `💬 Please link your eth using this link: ${this.backendApi}/link/${code} will expire in 15 minutes`
          )
          break
        case 'my-eth':
          if (!user.isSignedIn) {
            this.game.chat(`${user.id}`, [], user.map, '⚠️ You need to sign in with a gather account to see your eth address')
            break
          }
          const userLink = this.checkUserIsLinked(user)
          if (userLink) {
            this.game.chat(`${user.id}`, [], user.map, `💬 Your eth address is: ${userLink.address}`)
          } else {
            this.game.chat(`${user.id}`, [], user.map, '⛔ You dont have an eth address attached you can use /bot link-eth')
          }
          break
        case 'list-events':
          const teleports = this.teleportStore.get('teleports', [])
          console.log(teleports)
          const events = teleports.filter((t) => t.tokenGated === true)
          if (events.length > 0) {
            this.game.chat(
              `${user.id}`,
              [],
              user.map,
              `💬 Events availabe for you: \n ${events
                .map((e) => `EventName: ${e.joinAlias} \n Token Contract: ${e.tokenContract} \n Token Amount Needed: ${e.tokenAmount}`)
                .join('\n\n')}`
            )
          } else {
            this.game.chat(`${user.id}`, [], user.map, '⚠️ No events availabe!')
          }
          break
        case 'join': {
          if (!user.isSignedIn) {
            this.game.chat(`${user.id}`, [], user.map, '⛔ You need to be logged in with a gather account to join an event')
            break
          }
          const checkUserEth = this.checkUserIsLinked(user)
          if (!checkUserEth) {
            this.game.chat(
              `${user.id}`,
              [],
              user.map,
              '⛔ You are not linked to your Ethereum account, link before joining an event using /bot link-eth'
            )
            break
          }
          if (args.length < 1) {
            this.game.chat(`${user.id}`, [], user.map, '⛔ You need to specify an event name')
            break
          }
          const eventName = args[0]
          const teleports = this.teleportStore.get('teleports', [])
          const event = teleports.find((t) => t && t.joinAlias && t.joinAlias.toLowerCase() === eventName.toLowerCase())
          if (!event) {
            this.game.chat(`${user.id}`, [], user.map, '⚠️ Event not found use /bot list-events to see all events')
            break
          }
          const tokenBalance = await this.getPolyTokenBalance(checkUserEth.address, event.tokenContract)
          if (tokenBalance < event.tokenAmount) {
            this.game.chat(`${user.id}`, [], user.map, `⛔ You dont have enough tokens to join this event, you need ${event.tokenAmount}`)
            break
          }
          this.game.chat(`${user.id}`, [], user.map, `✨ You joined the event ${event.joinAlias} you will be teleported in 0.2 seconds`)
          this.game.teleport(event.map, event.x, event.y, user.id)
          break
        }
        case 'my-id': {
          this.game.chat(`${user.id}`, [], user.map, `💬 Your id is: \n ${user.id} \n`)
          break
        }
        default:
          if (!isAuthorized) {
            this.game.chat(`${user.id}`, [], user.map, unkownMsg)
          }
          break
        // this.game.chat(`${user.id}`, [], user.map, 'You are not authorized to use this bot.'
      }
    }
  }

  async onConnected(connected) {
    this.connected = connected
    if (this.debugLog) {
      console.log('Conected Status:', connected)
    }
    this.game.enter(this.space)
    this.enteredSpace = true
  }

  getUsers() {
    return Object.keys(this.game.players)
      .map((key) => {
        const player = this.game.players[key]
        player.id = key
        return player
      })
      .filter((player) => isFinite(player.x))
  }

  sendPoapToUsers(newUsers = false, near = false) {
    const links = this.poapLinksStore.get('links', [])
    const unusedLinks = links.filter((l) => !l.used)

    const filterExistingUsers = (users) => users.filter((user) => !this.usersPOAPSent.includes(user.id))
    const users = newUsers ? filterExistingUsers(this.getUsers()) : this.getUsers()
    let i = 0
    let z = 0
    const startSend = performance.now()
    users.forEach(async (user) => {
      if (!user.isSignedIn) {
        z++
        return
      }
      const link = unusedLinks[i]
      link.used = true
      link.user = `${user.name} (${user.id})`
      const code = link.url.substring(link.url.lastIndexOf('/') + 1)
      const msg = `[ATTENTION: ${user.name} ] Unique POAP claim links is: [ ${link.url} ] Code [ ${code} ] is automatically used for claim. `
      if (user.id) {
        try {
          this.game.chat(`${user.id}`, [], user.map, msg)
        } catch (err) {
          console.log('Error:', err)
        }
        this.usersPOAPSent.push(user.id)
        i++
      }
      logger.info(`${msg} - UserID: ${user.id} - ${user.name}`)
      await new Promise((resolve) => setTimeout(resolve, 100))
    })

    const endSend = performance.now()
    const logMsg = `📊 STATS: POAP sent to ${i} users. \n❗ Users Skiped due to low trust: ${z}. \n⌛ Processing time: ${
      (endSend - startSend) / 1000
    } seconds.`
    const encMsg = '\n\n💬 INFO: Be sure to claim your ⭐POAP⭐ using the link you have recived in DM.'
    logger.info(logMsg)
    this.game.chat('GLOBAL_CHAT', [], '', logMsg)
    setTimeout(() => {
      this.game.chat('GLOBAL_CHAT', [], '', encMsg)
    }, 200)
  }
}
