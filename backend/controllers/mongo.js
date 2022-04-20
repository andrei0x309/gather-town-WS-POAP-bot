import mongoose from 'mongoose'
import { ethChallengeModel } from '../../lib/mongo-models/GB_ethChallenge.js'
import { ethLinksModel } from '../../lib/mongo-models/GB_ethLinks.js'
import { poapLinksModel } from '../../lib/mongo-models/GB_poapLinks.js'
import { teleportModel } from '../../lib/mongo-models/GB_teleport.js'
import { settingsModel } from '../../lib/mongo-models/GB_settings.js'
import { logsModel } from '../../lib/mongo-models/GB_logs.js'
import { GatherPOAPBot } from '../../lib/index.js'
import path from 'path'
import { fileURLToPath } from 'url'
import Conf from 'conf'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cwd = path.resolve(path.join(__dirname, '../..', 'db'))

export const mainStore = new Conf({ configName: 'main', cwd })

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${MONGODB_URL.split('@')[1]}`)
})
mongoose.connection.on('error', console.error.bind(console, 'Mongoose default connection error:'))
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected')
})
const MONGODB_URL = mainStore.get('dbConnectionString', null)
const mongooseConnection = await mongoose.connect(MONGODB_URL)
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination')
  })
  process.exit(0)
})

const ethChallenge = ethChallengeModel(mongoose)
const ethLinks = ethLinksModel(mongoose)
const poapLinks = poapLinksModel(mongoose)
const teleport = teleportModel(mongoose)
const settings = settingsModel(mongoose)
const logs = logsModel(mongoose)

export let gatherBot = new GatherPOAPBot(cwd, 'mongodb', { ethChallenge, ethLinks, poapLinks, teleport, settings, logs })

export const ethChallengeGet = async (req, reply) => {
  const code = req.params.code

  const challenge = await ethChallenge.findOne({ code }).exec()
  if (!challenge) {
    reply.send({
      error: 'Challenge not found'
    })
    return
  }
  if (new Date() > challenge.expire) {
    reply.send({
      error: 'Challenge expired'
    })
    return
  }
  reply.send({
    challenge
  })
}

export const ethVerifyChallenge = async (req, reply) => {
  const { code, signature } = req.body

  const challenge = ethChallenge.findOne({ code }).exec()
  if (!challenge) {
    reply.send({
      error: 'Challenge not found'
    })
  } else {
    const { user, message } = challenge
    const recoveredAcct = await utils.verifyMessage(message, signature)

    const userLink = ethLinks.findOne({ user }).exec()
    if (!userLink) {
      await new ethLinks({ user, address: recoveredAcct }).save()
    } else {
      userLink.address = recoveredAcct
      await userLink.save()
    }
    reply.send({
      success: true
    })
  }
}

export const authEndpoints = async (req, reply) => {
  console.log(req.params)
  const command = req.params.command
  switch (command) {
    case 'connect-to-space': {
      if (!gatherBot) {
        gatherBot = new GatherPOAPBot(cwd, 'mongodb', { ethChallenge, ethLinks, poapLinks, teleport, settings, logs })
        do {
          await new Promise((resolve) => {
            setTimeout(resolve, 100)
          })
        } while (!gatherBot)
        if (!gatherBot.isConnected) {
          await gatherBot.gatherConnect
        }
      } else {
        await gatherBot.gatherConnect()
      }
      reply.send({
        success: true
      })
      break
    }
    case 'disconnect-from-space': {
      gatherBot.gatherDisconnect()
      gatherBot = null
      reply.send({
        success: true
      })
      break
    }
    case 'check-status': {
      const status = gatherBot && gatherBot.isConnected()
      reply.send({
        status
      })
    }
    case 'teleports-get': {
      const teleports = await teleport.find().exec()
      reply.send({
        teleports
      })
      break
    }
    case 'teleports-set': {
      const teleportAdd = req.body.teleports
      if (teleportAdd && teleportAdd.length < 1) {
        reply.send({
          error: 'No teleports set'
        })
        return
      }
      const neededKeys = ['teleportName', 'map', 'x', 'y']
      const checkKeys = teleportAdd.some((teleport) => {
        const missingKeys = neededKeys.filter((key) => {
          return !teleport[key]
        })
        if (missingKeys.length > 0) {
          return true
        }
      })
      if (checkKeys) {
        reply.send({
          error: 'Missing keys'
        })
        return
      }
      const names = teleportAdd.map((teleport) => {
        return teleport.teleportName
      })
      if (new Set(names).size !== names.length) {
        reply.send({
          error: 'Duplicate names'
        })
        return
      }
      teleportAdd.forEach(async (t) => {
        t.x = Number(t.x) || 0
        t.y = Number(t.y) || 0
        t.tokenAmount = Number(t.tokenAmount) || 0
        await new teleport(t).save()
      })
      reply.send({
        success: true
      })
      break
    }
    case 'poap-links-get': {
      const links = (await poapLinks.find({}).exec()) || []
      const linksArr = []
      for (const link of links) {
        linksArr.push(link.url)
      }
      reply.send({
        links: linksArr
      })
      break
    }
    case 'poap-links-set': {
      const poapLinksAdd = req.body.links
      if (poapLinksAdd && poapLinksAdd.length < 1) {
        reply.send({
          error: 'No links to save or `links` field not set'
        })
        return
      }
      const poapLinksToAdd = poapLinksAdd.map((link) => {
        return {
          user: '',
          url: link,
          used: false
        }
      })
      // console.log(poapLinksToAdd)
      await poapLinks.deleteMany({}).exec()
      await poapLinks.insertMany(poapLinksToAdd)
      reply.send({
        success: true
      })
      break
    }
    case 'gather-space-api-key-get': {
      const apiKey = mainStore.get('apiKey', null)
      const gatherSpace = mainStore.get('gatherSpace', null)
      reply.send({
        apiKey,
        gatherSpace
      })
    }
    case 'gather-space-api-key-set': {
      const apiKey = req.body.apiKey
      const gatherSpace = req.body.gatherSpace
      if (!apiKey || !gatherSpace) {
        reply.status(401).send({
          error: 'Missing required fields'
        })
        return
      }
      mainStore.set('apiKey', apiKey)
      mainStore.set('gatherSpace', gatherSpace)
      reply.send({
        success: true
      })
      break
    }
    case 'settings-get': {
      const foundSettings = settings.findOne({}).exec() || {}
      reply.send({
        settings: foundSettings
      })
      break
    }
    case 'settings-set': {
      const receivedSettings = req.body.settings
      if (!receivedSettings || !receivedSettings.authUsers) {
        reply.send({
          error: 'No settings provided'
        })
        return
      }
      const uniqueUsers = []
      receivedSettings.authUsers.forEach((user) => {
        if (uniqueUsers.includes(user)) {
          reply.send({
            error: `Duplicate user: ${user}`
          })
          return
        }
        uniqueUsers.push(user)
      })
      if (receivedSettings.authUsers) {
        await settings.findOneAndUpdate(
          {},
          {
            $set: {
              authUsers: receivedSettings.authUsers
            }
          }
        )
      }
      if (gatherBot) {
        await gatherBot.reloadSettings()
      }
      reply.send({
        success: true
      })
      break
    }
    default: {
      reply.status(401).send({
        error: 'Unknown command'
      })
    }
  }
}
