import type { Server } from 'http'
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import qs from 'koa-qs'
import Router from '@koa/router'
import { connectToDatabase } from './db'
import { RegisterRoutes } from '../build/routes'
import fs from 'node:fs'
import path from 'node:path'

export default function startServer(
  port: number = 3000,
  testMode: boolean = false,
): Server {
  const app = new Koa()
  qs(app)

  app.use(cors())
  app.use(bodyParser())

  const tsoaRouter = new Router()
  RegisterRoutes(tsoaRouter)
  app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/api')) {
      ctx.path = ctx.path.replace('/api', '') || '/'
    }
    await next()
  })

  app.use(tsoaRouter.routes())
  app.use(tsoaRouter.allowedMethods())

  const docsRouter = new Router()

  docsRouter.get('/docs/spec', (ctx) => {
    const specPath = path.join(process.cwd(), 'build', 'swagger.json')
    ctx.type = 'application/json'
    ctx.body = fs.readFileSync(specPath, 'utf8')
  })

  app.use(docsRouter.routes())
  app.use(docsRouter.allowedMethods())

  if (!testMode) {
    connectToDatabase()
      .then(() => {
        console.log('Database connected')
      })
      .catch((err) => {
        console.warn('Database connection failed, continuing without DB')
        console.warn(err.message)
      })
  }

  const server = app.listen(port, () => {
    if (!testMode) {
      console.log(`Server running on http://localhost:${port}`)
    }
  })

  return server
}
