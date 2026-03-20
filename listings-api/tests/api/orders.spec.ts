import { test, expect } from 'vitest'
import setup, { type ServerTestContext } from './run_server'
import { BooksApi, Configuration, OrdersApi, WarehouseApi } from '../../client'

setup()

test<ServerTestContext>('can create an order, list it, and fulfil it (SDK only)', async ({
  address,
}) => {
  const config = new Configuration({ basePath: address })
  const books = new BooksApi(config)
  const warehouse = new WarehouseApi(config)
  const orders = new OrdersApi(config)

  const created = await books.createBook({
    bookPayload: {
      name: 'Order Test Book',
      author: 'Order Test Author',
      description: 'Order Test Description',
      price: 12.34,
      image: 'https://example.com/order-test.png',
    },
  })

  await warehouse.placeBooksOnShelf({
    bookId: created.id,
    shelfId: 'A1',
    shelfCountPayload: { count: 2 },
  })

  const order = await orders.orderBooks({
    orderBooksPayload: { books: [created.id, created.id] },
  })

  expect(typeof order.orderId).toBe('string')
  expect(order.orderId.length).toBeGreaterThan(0)

  const listed = await orders.listOrders()
  const found = listed.find((o) => o.orderId === order.orderId)
  expect(found).toBeDefined()
  expect(found?.books[created.id]).toBe(2)

  await orders.fulfilOrder({
    orderId: order.orderId,
    fulfilOrderPayload: {
      booksFulfilled: [{ book: created.id, shelf: 'A1', numberOfBooks: 2 }],
    },
  })

  await books.deleteBook({ id: created.id })
})
