import { test, expect } from 'vitest'
import setup, { type ServerTestContext } from './run_server'
import { BooksApi, Configuration } from '../../client'

setup()

test<ServerTestContext>('can place books on a shelf and then fetch shelves (SDK only)', async ({
  address,
}) => {
  const config = new Configuration({ basePath: address })
  const books = new BooksApi(config)

  const created = await books.createBook({
    bookPayload: {
      name: 'Warehouse Test Book',
      author: 'Test Author',
      description: 'Test Description',
      price: 12.34,
      image: 'https://example.com/test.png',
    },
  })

  const listed = await books.listBooks()
  const found = listed.find((b: any) => b.id === created.id)

  expect(found).toBeDefined()

  await books.deleteBook({ id: created.id })
})
