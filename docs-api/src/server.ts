import Koa from 'koa'
import { koaSwagger } from 'koa2-swagger-ui'

const app = new Koa()

app.use(
  koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: {
      url: '/docs/spec',
    },
  }),
)

export default app