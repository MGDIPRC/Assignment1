import Router from '@koa/router'
import type Koa from 'koa'
import listRouter from './lists'
import assignment from '../../adapter/assignment-2'
import type { Book } from '../../adapter/assignment-2'


const router = new Router()

// List book route
router.use(listRouter.routes())
router.use(listRouter.allowedMethods())

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Something went wrong'
}

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>

  return (
    typeof v.name === 'string' &&
    typeof v.author === 'string' &&
    typeof v.description === 'string' &&
    typeof v.price === 'number' &&
    typeof v.image === 'string'
  )
}

function handleError(ctx: Koa.Context, err: unknown): void {
  const message = getErrorMessage(err)
  const messageLower = message.toLowerCase()

  if (
    messageLower.includes("can't find") ||
    messageLower.includes("couldn't find")
  ) {
    ctx.status = 404
  } else if (
    messageLower.includes('need') ||
    messageLower.includes('please') ||
    messageLower.includes("doesn't look right") ||
    messageLower.includes('no book')
  ) {
    ctx.status = 400
  } else {
    ctx.status = 500
  }

  ctx.body = { error: message }
}

// Create book route
router.post('/books', async (ctx) => {
  try {
    const payload: unknown = ctx.request.body

    if (!isBook(payload)) {
      ctx.status = 400
      ctx.body = { error: 'Invalid book payload' }
      return
    }

    const id = await assignment.createOrUpdateBook(payload)
    ctx.status = 201
    ctx.body = { id }
  } catch (err) {
    handleError(ctx, err)
  }
})

// Update book route
router.put('/books/:id', async (ctx) => {
  try {
    const idParam: unknown = ctx.params.id

    if (typeof idParam !== 'string' || idParam.trim() === '') {
      ctx.status = 400
      ctx.body = { error: 'Missing book id' }
      return
    }

    const payload: unknown = ctx.request.body
    const merged: unknown =
      typeof payload === 'object' && payload !== null
        ? { ...(payload as Record<string, unknown>), id: idParam }
        : { id: idParam }

    if (!isBook(merged)) {
      ctx.status = 400
      ctx.body = { error: 'Invalid book payload' }
      return
    }

    const updatedId = await assignment.createOrUpdateBook(merged)
    ctx.status = 200
    ctx.body = { id: updatedId }
  } catch (err) {
    handleError(ctx, err)
  }
})

// Delete book route
router.delete('/books/:id', async (ctx) => {
  try {
    const idParam: unknown = ctx.params.id

    if (typeof idParam !== 'string' || idParam.trim() === '') {
      ctx.status = 400
      ctx.body = { error: 'Missing book id' }
      return
    }

    await assignment.removeBook(idParam)
    ctx.status = 204
  } catch (err) {
    handleError(ctx, err)
  }
})

export default router
