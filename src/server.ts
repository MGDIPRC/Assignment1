import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import qs from 'koa-qs'
import bookRoutes from './books/book_routes'
import { connectToDatabase } from './db'

const app = new Koa()
qs(app)

const portRaw = process.env.PORT

const port =
  portRaw !== undefined && portRaw.trim() !== '' ? Number(portRaw) : 3000

if (!Number.isFinite(port)) {
  throw new Error('PORT must be a valid number')
}

app.use(cors())
app.use(bodyParser())
app.use(bookRoutes.allowedMethods())
app.use(bookRoutes.routes())

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to start server (DB connection failed).')
    console.error(err)
    process.exit(1)
  })
