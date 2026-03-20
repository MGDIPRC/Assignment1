import Koa from "koa"
import bodyParser from 'koa-bodyparser'
import ordersRouter from './orders/orders.routes'

const app = new Koa();

app.use(bodyParser())
app.use(ordersRouter.routes())
app.use(ordersRouter.allowedMethods())

export default app