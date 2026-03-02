import startServer from './server'

const portRaw = process.env.PORT
const port = portRaw !== undefined && portRaw.trim() !== '' ? Number(portRaw) : 3000

if (!Number.isFinite(port)) {
  throw new Error('PORT must be a valid number')
}

startServer(port, false)