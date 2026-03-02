import { test, expect } from 'vitest'
import setup, { type ServerTestContext } from './run_server'
import { BooksApi, Configuration } from '../../client'

setup()

test<ServerTestContext>('can create a book and then fetch it (SDK only)', async ({ address }) => {
  const client = new BooksApi(new Configuration({ basePath: address }))

  const created = await client.createBook({
    bookPayload: {
      name: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      price: 9.99,
      image: 'https://example.com/test.png'
    }
  })

  expect(typeof created.id).toBe('string')
  expect(created.id.length).toBeGreaterThan(0)

  const book = await client.getBookById({ id: created.id })
  expect(book).toBeDefined()
})