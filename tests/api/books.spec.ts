import { test, expect } from 'vitest'
import setup, { type ServerTestContext } from './run_server'
import { BooksApi, Configuration } from '../../client'

setup()

test<ServerTestContext>('can create, update, then fetch a book (SDK only)', async ({
  address,
}) => {
  const client = new BooksApi(new Configuration({ basePath: address }))

  const created = await client.createBook({
    bookPayload: {
      name: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      price: 9.99,
      image: 'https://example.com/test.png',
    },
  })

  expect(typeof created.id).toBe('string')
  expect(created.id.length).toBeGreaterThan(0)

  const book1 = await client.getBookById({ id: created.id })
  expect(book1).toBeDefined()

  const updated = await client.updateBook({
    id: created.id,
    bookPayload: {
      name: 'Test Book UPDATED',
      author: 'Test Author',
      description: 'Test Description',
      price: 10.99,
      image: 'https://example.com/test.png',
    },
  })

  expect(updated.id).toEqual(created.id)

  const book2 = await client.getBookById({ id: created.id })
  expect(book2).toBeDefined()

  await client.deleteBook({ id: created.id })

  await expect(client.getBookById({ id: created.id })).rejects.toBeDefined()
})
