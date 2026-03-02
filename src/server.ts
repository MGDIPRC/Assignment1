import warehouseRoutes from './warehouse/warehouse.routes'
import orderRoutes from './orders/orders.routes'
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import qs from 'koa-qs'
import bookRoutes from './books/book_routes'
import { connectToDatabase } from './db'
import { RegisterRoutes } from '../build/routes'
import Router from '@koa/router'
import swagger from '../build/swagger.json'

const { koaSwagger } = require('koa2-swagger-ui')


export default function startServer(port: number = 3000, testMode: boolean = false) {
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

  app.use(
    koaSwagger({
      routePrefix: '/docs',
      swaggerOptions: {
        url: '/docs/spec'
      }
    })
  )

  app.use(docsRouter.routes())
  app.use(docsRouter.allowedMethods())

  app.use(bookRoutes.routes())
  app.use(bookRoutes.allowedMethods())

  app.use(warehouseRoutes.routes())
  app.use(warehouseRoutes.allowedMethods())

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