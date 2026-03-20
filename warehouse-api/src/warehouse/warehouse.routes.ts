import Router from '@koa/router'
import type Koa from 'koa'
import { DatabaseWarehouse } from './warehouse.database'


const warehouse = new DatabaseWarehouse()
const router = new Router()

router.post('/warehouse/:bookId/shelves/:shelfId', async (ctx: Koa.Context) => {
  const { bookId, shelfId } = ctx.params
  const body = (ctx.request as any).body

  if (typeof bookId !== 'string' || bookId.trim() === '') {
    ctx.status = 400
    ctx.body = { error: 'Missing book id' }
    return
  }

  if (typeof shelfId !== 'string' || shelfId.trim() === '') {
    ctx.status = 400
    ctx.body = { error: 'Missing shelf id' }
    return
  }

  const count =
    typeof body === 'object' && body !== null && 'count' in body
      ? (body as Record<string, unknown>).count
      : undefined

  if (typeof count !== 'number' || !Number.isFinite(count)) {
    ctx.status = 400
    ctx.body = { error: 'Missing or invalid count' }
    return
  }

  await warehouse.placeBookOnShelf(bookId, shelfId, count)
  ctx.status = 204
})

router.get('/warehouse/:bookId', async (ctx: Koa.Context) => {
  const { bookId } = ctx.params

  if (typeof bookId !== 'string' || bookId.trim() === '') {
    ctx.status = 400
    ctx.body = { error: 'Missing book id' }
    return
  }

  const shelves = await warehouse.getCopiesByShelf(bookId)
  ctx.status = 200
  ctx.body = shelves
})

export default router
