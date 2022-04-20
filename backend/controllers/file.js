import Conf from 'conf'
import path from 'path'
import { fileURLToPath } from 'url'
import { GatherPOAPBot } from '../../lib/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cwd = path.resolve(path.join(__dirname, '../..', 'db'))

export let gatherBot = new GatherPOAPBot(cwd)

export const mainStore = new Conf({ configName: 'main', cwd })
const teleportStore = new Conf({ configName: 'teleport', cwd })
const poapLinksStore = new Conf({ configName: 'poap-links', cwd })
const ethChallengeStore = new Conf({ configName: 'eth-challenge', cwd })
const ethLinksStore = new Conf({ configName: 'eth-links', cwd })
const settingsStore = new Conf({ configName: 'settings', cwd })

export const ethChallengeGet = async (req, reply) => {
  console.log(req.params.code)
  const code = req.params.code
  const challenges = ethChallengeStore.get('challenges', [])
  const filterExpired = challenges.filter((challenge) => {
    return Date.now() < challenge.expire
  })
  ethChallengeStore.set('challenges', filterExpired)
  console.log(filterExpired)
  const challenge = filterExpired.find((challenge) => {
    return String(challenge.code) === String(code)
  })
  if (!challenge) {
    reply.send({
      error: 'Challenge not found'
    })
  } else {
    reply.send({
      challenge
    })
  }
}

export const ethVerifyChallenge = async (req, reply) => {
  const { code, signature } = req.body
  const challenges = ethChallengeStore.get('challenges', [])
  const challenge = challenges.find((challenge) => {
    return String(challenge.code) === String(code)
  })
  const deleteChallenge = challenges.filter((challenge) => {
    return String(challenge.code) !== String(code)
  })
  ethChallengeStore.set('challenges', deleteChallenge)
  if (!challenge) {
    reply.send({
      error: 'Challenge not found'
    })
  } else {
    const { user, message } = challenge
    const recoveredAcct = await utils.verifyMessage(message, signature)
    const links = ethLinksStore.get('users', [])
    const link = links.find((link) => {
      return link.user === user
    })
    if (!link) {
      links.push({
        user,
        address: recoveredAcct
      })
    } else {
      link.address = recoveredAcct
    }
    ethLinksStore.set('users', links)
    reply.send({
      success: true
    })
  }
}

export const authEndpoints = async (req, reply) => {
  const command = req.params.command
  switch (command) {
    case 'connect-to-space': {
      if (!gatherBot) {
        gatherBot = new GatherPOAPBot(cwd)
        console.log('here')
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
      const teleports = teleportStore.get('teleports', [])
      reply.send({
        teleports
      })
      break
    }
    case 'teleports-set': {
      const teleportAdd = req.body.teleports
      console.log(teleportAdd)
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
      teleportAdd.forEach((teleport) => {
        teleport.x = Number(teleport.x) || 0
        teleport.y = Number(teleport.y) || 0
        teleport.tokenAmount = Number(teleport.tokenAmount) || 0
      })
      teleportStore.set('teleports', teleportAdd)
      reply.send({
        success: true
      })
      break
    }
    case 'poap-links-get': {
      const links = poapLinksStore.get('links', [])
      let mapLinks
      if (links.length > 0) {
        mapLinks = links.map((link) => link.url)
      } else {
        mapLinks = []
      }
      reply.send({
        links: mapLinks
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
      poapLinksStore.set('links', poapLinksToAdd)
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
      const authUsers = settingsStore.get('authUsers', [])
      const settings = {
        authUsers
      }
      reply.send({
        settings
      })
      break
    }
    case 'settings-set': {
      const settings = req.body.settings
      if (!settings || !settings.authUsers) {
        reply.send({
          error: 'No settings provided'
        })
        return
      }
      const uniqueUsers = []
      settings.authUsers.forEach((user) => {
        if (uniqueUsers.includes(user)) {
          reply.send({
            error: `Duplicate user: ${user}`
          })
          return
        }
        uniqueUsers.push(user)
      })
      if (settings.authUsers) {
        settingsStore.set('authUsers', settings.authUsers)
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
