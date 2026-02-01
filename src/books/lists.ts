import Router from '@koa/router'
import { type Book } from '../../adapter/assignment-1'
import books from '../../mcmasterful-book-list.json'

const listRouter = new Router()

listRouter.get('/books', async (ctx): Promise<void> => {
  const filtersRaw = ctx.query.filters

  const filters =
    Array.isArray(filtersRaw) && filtersRaw.length > 0
      ? (filtersRaw as Array<{ from?: string, to?: string }>)
      : undefined

  try {
    const bookList = readBooksFromJsonData()

    if (filters !== undefined) {
      if (!validateFilters(filters)) {
        ctx.status = 400
        ctx.body = {
          error:
            'Invalid filters. Each filter must have valid "from" and "to" numbers where from <= to.'
        }
        return
      }

      ctx.body = filterBooks(bookList, filters)
      return
    }

    ctx.body = bookList
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: `Failed to fetch books due to: ${String(error)}` }
  }
})

function validateFilters (
  filters: Array<{ from?: string, to?: string }>
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

function readBooksFromJsonData (): Book[] {
  return books as Book[]
}

// Filter books by price range - a book matches if it falls within ANY of the filter ranges
function filterBooks (
  bookList: Book[],
  filters: Array<{ from?: string, to?: string }>
): Book[] {
  return bookList.filter((book) =>
    filters.some((filter) => {
      const from =
        filter.from !== undefined ? parseFloat(filter.from) : undefined
      const to = filter.to !== undefined ? parseFloat(filter.to) : undefined

      const matchesFrom = from === undefined || book.price >= from
      const matchesTo = to === undefined || book.price <= to

      return matchesFrom && matchesTo
    })
  )
}

export default listRouter
