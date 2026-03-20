import Router from '@koa/router'
import type Koa from 'koa'
import assignment from '../../adapter/assignment-4'

const router = new Router()

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string')
}

interface FulfilmentInput {
  book: string
  shelf: string
  numberOfBooks: number
}

function isFulfilmentInputArray(value: unknown): value is FulfilmentInput[] {
  return (
    Array.isArray(value) &&
    value.every((x) => {
      if (typeof x !== 'object' || x === null) return false
      const v = x as Record<string, unknown>
      return (
        typeof v.book === 'string' &&
        typeof v.shelf === 'string' &&
        typeof v.numberOfBooks === 'number'
      )
    })
  )
}

router.post('/orders', async (ctx: Koa.Context) => {
  const body: unknown = ctx.request.body

  const books =
    typeof body === 'object' && body !== null && 'books' in body
      ? (body as Record<string, unknown>).books
      : undefined

  if (!isStringArray(books)) {
    ctx.status = 400
    ctx.body = { error: 'Invalid books list' }
    return
  }

  const result = await assignment.orderBooks(books)
  ctx.status = 201
  ctx.body = result
})

router.get('/orders', async (ctx: Koa.Context) => {
  const orders = await assignment.listOrders()
  ctx.status = 200
  ctx.body = orders
})

router.post('/orders/:orderId/fulfil', async (ctx: Koa.Context) => {
  const { orderId } = ctx.params
  const body: unknown = ctx.request.body

  if (typeof orderId !== 'string' || orderId.trim() === '') {
    ctx.status = 400
    ctx.body = { error: 'Missing order id' }
    return
  }

  const booksFulfilled =
    typeof body === 'object' && body !== null && 'booksFulfilled' in body
      ? (body as Record<string, unknown>).booksFulfilled
      : undefined

  if (!isFulfilmentInputArray(booksFulfilled)) {
    ctx.status = 400
    ctx.body = { error: 'Invalid booksFulfilled entries' }
    return
  }

  await assignment.fulfilOrder(orderId, booksFulfilled)
  ctx.status = 204
})

export default router
