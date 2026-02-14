import previous_assignment from './assignment-3'
import assignment2 from './assignment-2'

import { InMemoryWarehouse } from '../src/warehouse/warehouse.memory'
import { createOrdersMemory } from '../src/orders/orders.memory'
import { DatabaseWarehouse } from '../src/warehouse/warehouse.database'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
  stock?: number
}

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
}

const warehouse =
  process.env.MONGODB_URI !== undefined && process.env.MONGODB_URI.trim() !== ''
    ? new DatabaseWarehouse()
    : new InMemoryWarehouse()

const orders = createOrdersMemory()

function asRecordOfCounts(ids: BookID[]): Record<BookID, number> {
  const result: Record<BookID, number> = {}
  for (const id of ids) result[id] = (result[id] ?? 0) + 1
  return result
}

async function getBookByIdOrThrow(id: BookID): Promise<Book> {
  const anyPrev = previous_assignment as any

  if (typeof anyPrev.lookupBookById === 'function') {
    return (await anyPrev.lookupBookById(id)) as Book
  }

  if (typeof anyPrev.getBookById === 'function') {
    return (await anyPrev.getBookById(id)) as Book
  }

  if (typeof (assignment2 as any).getBookById === 'function') {
    return (await (assignment2 as any).getBookById(id)) as Book
  }

  if (typeof anyPrev.listBooks === 'function') {
    const all = (await anyPrev.listBooks()) as Book[]
    const found = all.find((b) => b.id === id)
    if (found) return found
  }

  throw new Error("I can't find a book with that ID")
}

async function listBooks(filters?: Filter[]): Promise<Book[]> {
  const anyPrev = previous_assignment as any

  const baseBooks: Book[] =
    typeof anyPrev.listBooks === 'function'
      ? ((await anyPrev.listBooks(filters)) as Book[])
      : ((await (assignment2 as any).listBooks(
          (filters ?? []).map((f: Filter) => ({ from: f.from, to: f.to })),
        )) as Book[])

  // Add stock totals
  const withStock = await Promise.all(
    baseBooks.map(async (b) => {
      const id = b.id
      if (!id) return b
      const stock = await warehouse.getTotalCopies(id)
      return { ...b, stock }
    }),
  )

  return withStock
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  return (await (previous_assignment as any).createOrUpdateBook(book)) as BookID
}

async function removeBook(book: BookID): Promise<void> {
  await (previous_assignment as any).removeBook(book)
}

async function lookupBookById(bookId: BookID): Promise<Book> {
  const book = await getBookByIdOrThrow(bookId)
  const stock = await warehouse.getTotalCopies(bookId)
  return { ...book, stock }
}

export type ShelfId = string
export type OrderId = string

async function placeBooksOnShelf(
  bookId: BookID,
  numberOfBooks: number,
  shelf: ShelfId,
): Promise<void> {
  // Validate book id exists
  await getBookByIdOrThrow(bookId)

  await warehouse.placeBookOnShelf(bookId, shelf, numberOfBooks)
}

async function orderBooks(bookIds: BookID[]): Promise<{ orderId: OrderId }> {
  // Orders need valid ids and gives an error if there isn't a valid id
  for (const id of bookIds) {
    await getBookByIdOrThrow(id)
  }

  const counts = asRecordOfCounts(bookIds)
  const items = Object.entries(counts).map(([bookId, qty]) => ({ bookId, qty }))

  const created = orders.createOrder({ items })
  return { orderId: created.id }
}

async function findBookOnShelf(
  bookId: BookID,
): Promise<Array<{ shelf: ShelfId; count: number }>> {
  await getBookByIdOrThrow(bookId)

  const byShelf = await warehouse.getCopiesByShelf(bookId)
  return Object.entries(byShelf)
    .map(([shelf, count]) => ({ shelf, count: count as number }))
    .filter((x) => x.count !== 0)
}

async function fulfilOrder(
  orderId: OrderId,
  booksFulfilled: Array<{
    book: BookID
    shelf: ShelfId
    numberOfBooks: number
  }>,
): Promise<void> {
  const order = orders.getOrderById(orderId)
  if (order === null) throw new Error("I can't find an order with that ID")

  // Build the required totals from the order
  const required: Record<BookID, number> = {}
  for (const item of order.items) {
    required[item.bookId] = (required[item.bookId] ?? 0) + item.qty
  }

  // Build the totals from the fulfilment request
  const fulfilledTotals: Record<BookID, number> = {}
  for (const f of booksFulfilled) {
    fulfilledTotals[f.book] = (fulfilledTotals[f.book] ?? 0) + f.numberOfBooks
  }

  // Fulfil what the order actually wants
  for (const [bookId, qty] of Object.entries(required)) {
    if ((fulfilledTotals[bookId] ?? 0) !== qty) {
      throw new Error("This doesn't look right")
    }
  }
  for (const bookId of Object.keys(fulfilledTotals)) {
    if (required[bookId] === undefined) {
      throw new Error("This doesn't look right")
    }
  }

  // Check the stock on shelves first and then subtract from that
  for (const f of booksFulfilled) {
    const available = await warehouse.getCopiesOnShelf(f.book, f.shelf)
    if (available < f.numberOfBooks) {
      throw new Error("There isn't enough stock on the shelves")
    }
  }

  for (const f of booksFulfilled) {
    await warehouse.placeBookOnShelf(f.book, f.shelf, -f.numberOfBooks)
  }

  orders.markFulfilled(orderId)
}

async function listOrders(): Promise<
  Array<{ orderId: OrderId; books: Record<BookID, number> }>
> {
  return orders
    .listOrders()
    .map((o: { id: string; items: Array<{ bookId: string; qty: number }> }) => {
      const books: Record<BookID, number> = {}
      for (const item of o.items) {
        books[item.bookId] = (books[item.bookId] ?? 0) + item.qty
      }
      return { orderId: o.id, books }
    })
}

const assignment = 'assignment-4'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById,
}
