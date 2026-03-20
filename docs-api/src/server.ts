import Koa from "koa"
import { koaSwagger } from "koa2-swagger-ui";
import fs from 'fs'
import path from 'path'

const app = new Koa()

const swaggerPath = path.join(
  process.cwd(),
  '..',
  'listings-api',
  'build',
  'swagger.json'
)

console.log('Swagger path:', swaggerPath)

const swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))

app.use(async (ctx, next) => {
  if (ctx.path === '/docs/spec') {
    ctx.body = swaggerSpec
  } else {
    await next()
  }
})

app.use(
  koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: {
      spec: swaggerSpec,
    },
  }),
)

export default app