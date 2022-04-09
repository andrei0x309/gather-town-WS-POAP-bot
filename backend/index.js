import fastify from 'fastify'
import fastCors from 'fastify-cors'
import { fileURLToPath } from 'url'
import Conf from 'conf'
import path from 'path'
import crypto from 'crypto'
import GatherPOAPBot from '../lib/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 4552

const app = fastify({
  logger: false,
  maxParamLength: 1500
})

const cwd = path.resolve(path.join(__dirname, '..', 'db'))

let gatherBot = new GatherPOAPBot(cwd)

const mainStore = new Conf({ configName: 'main', cwd })
const teleportStore = new Conf({ configName: 'teleport', cwd })
const poapLinksStore = new Conf({ configName: 'poap-links', cwd })
// const settingsStore = new Conf({ configName: 'settings', cwd })

const decryptData = async (secret, iv, email) => {
  const pIV = Buffer.from(iv, 'base64')
  const digest = crypto.createHash('sha256').update(email).digest()
  const ckey = await crypto.webcrypto.subtle.importKey(
    'raw',
    digest,
    {
      name: 'AES-CBC',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  )

  const decipher = crypto.createDecipheriv('aes-256-cbc', ckey, pIV)
  let decrypted = decipher.update(secret, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

const checkAuth = async (secret, iv, email) => {
  const decrypted = await decryptData(secret, iv, email)
  const password = mainStore.get('password', null)
  return password === decrypted
}

const checkAutHandler = async (req, reply, done) => {
  const secret = req.headers['x-secret']
  const iv = req.headers['x-iv']
  if (!secret || !iv) {
    reply.send({
      error: 'No secret or iv'
    })
    return done()
  }
  const email = mainStore.get('email', null)
  if (!email) {
    reply.send({
      error: 'No email set on server auth error'
    })
    return done()
  }

  if (!checkAuth(secret, iv, email)) {
    reply.send({
      error: 'Invalid secret'
    })
    return done()
  }
  done()
}

const isSetupCheck = () => {
  const email = mainStore.get('email', null)
  const password = mainStore.get('password', null)
  return !!(!email || !password)
}

app.register(fastCors, {})

app.get('/is-setup', async (req, reply) => {
  reply.send({
    setup: isSetupCheck()
  })
})

app.post('/setup', async (req, reply) => {
  if (!isSetupCheck()) {
    reply.send({
      error: 'Already setup'
    })
    return
  }
  const { email, password, gatherSpace, apiKey } = req.body
  if (!email || !password || !gatherSpace || !apiKey) {
    reply.send({
      error: 'Missing required fields'
    })
    return
  }
  mainStore.set('email', email)
  mainStore.set('password', password)
  mainStore.set('gatherSpace', gatherSpace)
  mainStore.set('apiKey', apiKey)
  reply.send({
    success: true
  })
})

app.post('/check-auth', async (req, reply) => {
  const secret = req.headers['x-secret']
  const iv = req.headers['x-iv']
  if (!secret || !iv) {
    reply.send({
      error: 'No secret or iv'
    })
  }
  const email = mainStore.get('email', null)
  if (!email) {
    reply.send({
      error: 'No email set on server auth error'
    })
  }

  reply.send({
    success: await checkAuth(secret, iv, email)
  })
})

app.all('/logged/:command', {
  preValidation: checkAutHandler,
  handler: async (req, reply) => {
    const command = req.params.command
    switch (command) {
      case 'connect-to-space': {
        if (!gatherBot || !gatherBot.isConnected) {
          gatherBot = new GatherPOAPBot(cwd)
          console.log('here')
          do {
            await new Promise((resolve) => {
              setTimeout(resolve, 100)
            })
          } while (!gatherBot)
          await gatherBot.gatherConnect()
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
        reply.send({
          status: gatherBot.isConnected()
        })
      }
      case 'teleport-get': {
        const teleport = teleportStore.get('teleport', null)
        reply.send({
          teleport
        })
        break
      }
      case 'teleport-set': {
        const teleportAdd = req.body.teleport
        const teleportSet = teleportStore.get('teleport', [])
        teleportSet.push(teleportAdd)
        teleportStore.set('teleport', teleportSet)
        reply.send({
          success: true
        })
        break
      }
      case 'poap-links-get': {
        const poapLinks = poapLinksStore.get('poap-links', null)
        reply.send({
          poapLinks
        })
        break
      }
      case 'poap-links-set': {
        const poapLinksAdd = req.body.poapLinks
        const poapLinksSet = poapLinksStore.get('poap-links', [])
        poapLinksSet.push(poapLinksAdd)
        poapLinksStore.set('poap-links', poapLinksSet)
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
      }

      default: {
        reply.status(401).send({
          error: 'Unknown command'
        })
      }
    }
  }
})

const start = async () => {
  try {
    await app.listen(PORT)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

;(async () => {
  await start()
  console.log(`server listening on ${app.server.address().port}`)
})()
