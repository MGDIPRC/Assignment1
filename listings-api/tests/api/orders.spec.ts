import { test, expect } from 'vitest'
import setup, { type ServerTestContext } from './run_server'
import { BooksApi, Configuration } from '../../client'

setup()

test<ServerTestContext>('can create and delete a book (SDK only)', async ({
  address,
}) => {
  const config = new Configuration({ basePath: address })
  const books = new BooksApi(config)

  const created = await books.createBook({
    bookPayload: {
      name: 'Order Test Book',
      author: 'Order Test Author',
      description: 'Order Test Description',
      price: 12.34,
      image: 'https://example.com/order-test.png',
    },
  })

  expect(typeof created.id).toBe('string')

  const listed = await books.listBooks()
  const found = listed.find((b: any) => b.id === created.id)

  expect(found).toBeDefined()

  await books.deleteBook({ id: created.id })

  await expect(books.getBookById({ id: created.id })).rejects.toBeDefined()
})