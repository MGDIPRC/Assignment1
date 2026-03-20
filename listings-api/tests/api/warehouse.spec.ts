import { test, expect } from 'vitest'
import setup, { type ServerTestContext } from './run_server'
import { BooksApi, WarehouseApi, Configuration } from '../../client'

setup()

test<ServerTestContext>('can place books on a shelf and then fetch shelves (SDK only)', async ({
  address,
}) => {
  const config = new Configuration({ basePath: address })
  const books = new BooksApi(config)
  const warehouse = new WarehouseApi(config)

  const created = await books.createBook({
    bookPayload: {
      name: 'Warehouse Test Book',
      author: 'Test Author',
      description: 'Test Description',
      price: 12.34,
      image: 'https://example.com/test.png',
    },
  })

  const bookId = created.id
  const shelfId = 'A1'

  await warehouse.placeBooksOnShelf({
    bookId,
    shelfId,
    shelfCountPayload: { count: 3 },
  })

  const shelves = await warehouse.findBookOnShelf({ bookId })
  expect(shelves).toBeDefined()

  await books.deleteBook({ id: bookId })
})
