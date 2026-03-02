import type { Server } from 'http'
import Koa from 'koa'
import type { Middleware } from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import qs from 'koa-qs'
import Router from '@koa/router'
import orderRoutes from './orders/orders.routes'
import { connectToDatabase } from './db'
import { RegisterRoutes } from '../build/routes'
import swagger from '../build/swagger.json'
import { koaSwagger } from 'koa2-swagger-ui'

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
  app.use(tsoaRouter.routes())
  app.use(tsoaRouter.allowedMethods())

  const docsRouter = new Router()
  docsRouter.get('/docs/spec', (ctx) => {
    ctx.body = swagger
  })
  app.use(docsRouter.routes())
  app.use(docsRouter.allowedMethods())

  const swaggerMiddleware = koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: {
      url: '/docs/spec',
    },
  }) as unknown as Middleware
  app.use(swaggerMiddleware)

  app.use(orderRoutes.routes())
  app.use(orderRoutes.allowedMethods())

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
