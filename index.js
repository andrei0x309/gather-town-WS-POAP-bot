import dotenv from 'dotenv'
import { Game } from '@gathertown/gather-game-client'
import webSocket from 'isomorphic-ws'
import SimpleNodeLogger from 'simple-node-logger'
import path from 'path'
import fs from 'fs'

dotenv.config()
global.WebSocket = webSocket

const API_KEY = process.env.GATHER_API_KEY
const GATHER_SPACE = process.env.GATHER_SPACE

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs')
}

if (!fs.existsSync('usedLINKS.db')) {
  fs.writeFileSync('usedLINKS.db', '')
}

if (!fs.existsSync('currentLINKS.db')) {
  fs.writeFileSync('currentLINKS.db', '')
}

const currentClaimLinks = fs.readFileSync('currentLINKS.db', 'utf8')
const usedClaimLinks = fs.readFileSync('usedLINKS.db', 'utf8')

const linkPattern = /https?:\/\/.*?( |\n)/gms
const currentClaimLinksArr = currentClaimLinks.match(linkPattern)
  ? [...currentClaimLinks.match(linkPattern)].map((link) => link.slice(0, -1))
  : []
let usedClaimLinksArr = usedClaimLinks.match(linkPattern)
  ? [...usedClaimLinks.match(linkPattern)].map((link) => link.slice(0, -1))
  : []
let memClaimLinksArr = currentClaimLinksArr.filter((link) => !usedClaimLinksArr.includes(link))
let memUsedClaimLinksArr = []

const flushUsedClaimLinks = () => {
  memUsedClaimLinksArr = [...usedClaimLinksArr, ...memUsedClaimLinksArr]
  fs.writeFileSync('usedLINKS.db', memUsedClaimLinksArr.join('\n'), {
    encoding: 'utf8',
    flag: 'w+'
  })
  memUsedClaimLinksArr = []
  const usedClaimLinks = fs.readFileSync('usedLINKS.db', 'utf8')
  usedClaimLinksArr = usedClaimLinks.match(linkPattern)
    ? [...usedClaimLinks.match(linkPattern)].map((link) => link.slice(0, -1))
    : []
  memClaimLinksArr = currentClaimLinksArr.filter((link) => !usedClaimLinksArr.includes(link))
}

function createLogger (enableConsole, opts) {
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

const poapFarmers = [
  'poap.love',
  'Pineapple',
  'Sukey',
  'wawawell',
  '我是你二大爷',
  'Asc',
  'nathanzhang',
  'myIvan',
  'booot',
  '王者的',
  'lalalla',
  'stella',
  'herrz',
  'yinfei#6360',
  'daxian',
  'ethfly',
  'yangchaoyue',
  'nanci',
  'lily',
  'Jack',
  'lilei',
  'rongzhang',
  'tom',
  'ivan520',
  'timedao',
  'chairty',
  'liaowang',
  'aiblockchain',
  'LIU',
  'kio',
  'kaka',
  'YUP POAP BOT',
  'hyman',
  'nimokes',
  'kiwi',
  'LILY',
  'Metamoon',
  'hyamn',
  '王者荣耀',
  'yyds',
  'dd',
  'hanguoren',
  'xswl',
  'eleven',
  'rourou',
  'houyishiwo',
  'yule',
  'kikit',
  'buni',
  'victor',
  'Tony',
  'zhongwen',
  'lanse',
  'tuheu',
  'shufu',
  'nathanzhang',
  'rain',
  'yinfei',
  'abun',
  'meiner',
  'morning',
  'access',
  'weidde',
  'superr',
  'haare',
  'kathi',
  'Alen',
  'JackMan',
  'Anja',
  'laura',
  'masiwei',
  'yangchaoyue',
  'dexian',
  'woshishui',
  'xdsa',
  'xiansheng',
  'renwoxiayao',
  'harbin',
  'Sukey',
  'TonyB',
  'sanjin'
]

const whiteList = [
  'PBJ 🥪',
  'nir',
  'nir.eth',
  'Nir',
  'NIR',
  'Nir.eth'
]
class GatherPOAPBot {
  constructor (apiKey = API_KEY, gatherSpace = GATHER_SPACE, debugLog = true) {
    this.connected = false
    this.botId = 'w9TPUKsBkOOasECrD4yaSxefkir1'
    this.enteredSpace = false
    this.usersPOAPSent = []
    this.authorizedUsers = ['fW6l5sr0czZrXOpZQ5vvaslqOuQ2']
    this.space = gatherSpace
    this.debugLog = debugLog
    this.game = new Game(() => Promise.resolve({ apiKey: API_KEY }))
    this.game.connect(GATHER_SPACE)
    this.game.subscribeToConnection(this.onConnected.bind(this))
    this.game.subscribeToEvent('playerJoins', (player) => {
      if (this.debugLog) console.log('Player Joins Event:', player)
    })
    this.game.subscribeToEvent('playerChats', this.onCheckCommand.bind(this))
  }

  async onCheckCommand (msg, context) {
    if (msg.playerChats.contents.includes('/bot')) {
      const user = this.game.players[msg.playerChats.senderId]
      user.id = msg.playerChats.senderId

      if (this.authorizedUsers.includes(msg.playerChats.senderId)) {
        const command = msg.playerChats.contents.split('/bot')[1].trim()

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
            this.game.disconnect(this.space)
            break
          default:
            this.game.chat(`${user.id}`, [], user.map, 'Command not found')
        }
      } else {
        this.game.chat(`${user.id}`, [], user.map, 'You are not authorized to use this bot.')
      }
    }
  }

  async onConnected (connected) {
    this.connected = connected
    if (this.debugLog) {
      console.log('Conected Status:', connected)
    }
    this.game.enter(GATHER_SPACE)
    this.enteredSpace = true
  }

  sendPoapToUsers (newUsers = false, near = false) {
    const getUsers = () => Object.keys(this.game.players).map(key => { const player = this.game.players[key]; player.id = key; return player }).filter(player => isFinite(player.x))
    const filterExistingUsers = (users) => users.filter(user => !this.usersPOAPSent.includes(user.id))
    const users = newUsers ? filterExistingUsers(getUsers()) : getUsers()
    console.log(this.game.players)
    let i = 0
    let z = 0
    const startSend = performance.now()
    const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/
    users.forEach(async user => {
      const link = memClaimLinksArr[i]
      let msg
      if ((poapFarmers.includes(user.name) || user.name.length < 4 || user.name.match(REGEX_CHINESE)) && !whiteList.includes(user.name)) {
        msg = `${user.name} is a poap farmer!`
        z++
      } else {
        memUsedClaimLinksArr.push(link)
        const code = link.substring(link.lastIndexOf('/') + 1)
        msg = `[ATTENTION: ${user.name} ] Unique POAP claim links is: [ ${link} ] Code [ ${code} ] is automatically used for claim. `
        if (user.id) {
          try {
            this.game.chat(`${user.id}`, [], user.map, msg)
          } catch (err) {
            console.log('Error:', err)
          }
          this.usersPOAPSent.push(user.id)
          i++
        }
      }
      logger.info(`${msg} - UserID: ${user.id}`)
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    flushUsedClaimLinks()
    const endSend = performance.now()
    const logMsg = `STATS: POAP sent to ${i} users. Detected bots: ${z}. Processing time: ${(endSend - startSend) / 1000} seconds.`
    const encMsg = 'INFO: Be sure to claim your POAP using the link you have recived in DM.'
    logger.info(logMsg)
    this.game.chat('GLOBAL_CHAT', [], '', logMsg)
    setTimeout(() => {
      this.game.chat('GLOBAL_CHAT', [], '', encMsg)
    }, 200)
  }
}

export default GatherPOAPBot
