import Router from '@koa/router'
import type Koa from 'koa'
import assignment from '../../adapter/assignment-4'

const router = new Router()

router.post('/warehouse/:bookId/shelves/:shelfId', async (ctx: Koa.Context) => {
  const { bookId, shelfId } = ctx.params
  const body = ctx.request.body

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

  await assignment.placeBooksOnShelf(bookId, count, shelfId)
  ctx.status = 204
})

router.get('/warehouse/:bookId', async (ctx: Koa.Context) => {
  const { bookId } = ctx.params

  if (typeof bookId !== 'string' || bookId.trim() === '') {
    ctx.status = 400
    ctx.body = { error: 'Missing book id' }
    return
  }

  const shelves = await assignment.findBookOnShelf(bookId)
  ctx.status = 200
  ctx.body = shelves
})

export default router
