import Router from '@koa/router'
import assignment from '../../adapter/assignment-4'
import type { Filter } from '../../adapter/assignment-4'

const listRouter = new Router()

listRouter.get('/books', async (ctx): Promise<void> => {
  const filtersRaw = ctx.query.filters

  const filters =
    Array.isArray(filtersRaw) && filtersRaw.length > 0
      ? (filtersRaw as Array<{ from?: string; to?: string }>)
      : undefined

  try {
    if (filters !== undefined) {
      if (!validateFilters(filters)) {
        ctx.status = 400
        ctx.body = {
          error:
            'Invalid filters. Each filter must have valid "from" and "to" numbers where from <= to.',
        }
        return
      }

      const parsedFilters: Filter[] = filters.map((f) => ({
        from:
          typeof f.from === 'string' && f.from.trim() !== ''
            ? Number(f.from)
            : undefined,
        to:
          typeof f.to === 'string' && f.to.trim() !== ''
            ? Number(f.to)
            : undefined,
      }))

      ctx.body = await assignment.listBooks(parsedFilters)
      return
    }

    ctx.body = await assignment.listBooks()
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: `Failed to fetch books due to: ${String(error)}` }
  }
})

function validateFilters(
  filters: Array<{ from?: string; to?: string }>,
): boolean {
  return filters.every((filter) => {
    const fromRaw = filter.from
    const toRaw = filter.to

    const from =
      typeof fromRaw === 'string' && fromRaw.trim() !== ''
        ? Number(fromRaw)
        : undefined
    const to =
      typeof toRaw === 'string' && toRaw.trim() !== ''
        ? Number(toRaw)
        : undefined

    if (from !== undefined && Number.isNaN(from)) return false
    if (to !== undefined && Number.isNaN(to)) return false
    if (from !== undefined && to !== undefined && from > to) return false

    return true
  })
}

export default listRouter
