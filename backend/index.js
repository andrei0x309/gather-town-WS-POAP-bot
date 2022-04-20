import fastify from 'fastify'
import fastCors from 'fastify-cors'
import { fileURLToPath } from 'url'
import Conf from 'conf'
import path from 'path'
import crypto from 'crypto'
import { utils } from 'ethers'
import fastifyStatic from 'fastify-static'

let mongoose = null
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 4552

const app = fastify({
  logger: false,
  maxParamLength: 1500
})

app.register(fastifyStatic, {
  root: path.join(__dirname, '/../frontend/dist/'),
  allowedPath: (requestPath) => {
    if (requestPath.includes('/api/')) {
      return false
    }
    return true
  }
})

const cwd = path.resolve(path.join(__dirname, '..', 'db'))

const mainStore = new Conf({ configName: 'main', cwd })
const dbType = mainStore.get('dbType', null)

let controllers = {}
if (dbType === 'mongodb') {
  controllers = { ...(await import('./controllers/mongo.js')) }
} else if (dbType === 'file') {
  controllers = { ...(await import('./controllers/file.js')) }
} else {
  console.log(`No database type set, dbType is: ${dbType} supported types are: mongodb, file`)
  process.exit(1)
}

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

const checkAutHandler = (req, reply, done) => {
  const secret = req.headers['x-secret']
  const iv = req.headers['x-iv']
  if (!secret || !iv) {
    reply.send({
      error: 'No secret or iv'
    })
    return
  }
  const email = mainStore.get('email', null)
  if (!email) {
    reply.send({
      error: 'No email set on server auth error'
    })
    return
  }

  checkAuth(secret, iv, email).then((result) => {
    if (!result) {
      reply.send({
        error: 'Invalid auth credentials'
      })
    } else {
      done()
    }
  })
}

const isSetupCheck = () => {
  const email = mainStore.get('email', null)
  const password = mainStore.get('password', null)
  return !!(!email || !password)
}

app.register(fastCors, {})

app.get('/api/is-setup', async (req, reply) => {
  reply.send({
    setup: isSetupCheck()
  })
})

app.post('/api/setup', async (req, reply) => {
  if (!isSetupCheck()) {
    reply.send({
      error: 'Already setup'
    })
    return
  }
  const { email, password, gatherSpace, apiKey, backendHostname, polygonScanApiKey } = req.body
  if (
    !email ||
    !password ||
    !gatherSpace ||
    !apiKey ||
    !backendHostname ||
    !polygonScanApiKey ||
    !dbType ||
    (dbType === 'mongodb' && !dbConnectionString)
  ) {
    reply.send({
      error: 'Missing all required fields!'
    })
    return
  }
  mainStore.set('email', email)
  mainStore.set('password', password)
  mainStore.set('gatherSpace', gatherSpace)
  mainStore.set('apiKey', apiKey)
  mainStore.set('backendHostname', backendHostname)
  mainStore.set('polygonScanApiKey', polygonScanApiKey)
  mainStore.set('dbType', dbType)
  mainStore.set('dbConnectionString', dbConnectionString)
  if (controllers.gatherBot) {
    controllers.gatherBot.reloadMainStore()
  }
  reply.send({
    success: true
  })
})

app.post('/api/check-auth', async (req, reply) => {
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

app.get('/api/eth-challenge-get/:code', controllers.ethChallengeGet)
app.post('/api/eth-verify-challenge', controllers.ethVerifyChallenge)

app.route({
  method: ['GET', 'POST'],
  url: '/api/logged/:command',
  preValidation: checkAutHandler,
  handler: controllers.authEndpoints
})

const start = async () => {
  try {
    await app.listen(PORT, '0.0.0.0')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

;(async () => {
  await start()
  console.log(`server listening on ${app.server.address().port}`)
})()
