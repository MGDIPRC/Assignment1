import Koa from "koa"
import bodyParser from 'koa-bodyparser'
import warehouseRouter from './warehouse/warehouse.routes'

const app = new Koa();

app.use(bodyParser())
app.use(warehouseRouter.routes())
app.use(warehouseRouter.allowedMethods())

export default app;