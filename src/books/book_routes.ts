import Router from '@koa/router'
import type Koa from 'koa'
import listRouter from './lists'
import assignment from '../../adapter/assignment-4'

const router = new Router()

// List book route
router.use(listRouter.routes())
router.use(listRouter.allowedMethods())

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Something went wrong'
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

// Get single book route
router.get('/books/:id', async (ctx) => {
  try {
    const idParam: unknown = ctx.params.id

    if (typeof idParam !== 'string' || idParam.trim() === '') {
      ctx.status = 400
      ctx.body = { error: 'Missing book id' }
      return
    }

    const book = await assignment.lookupBookById(idParam)

    ctx.status = 200
    ctx.body = book
  } catch (err) {
    handleError(ctx, err)
  }
})
export default router
