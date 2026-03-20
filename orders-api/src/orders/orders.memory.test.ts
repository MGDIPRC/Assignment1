import { describe, expect, it } from 'vitest'
import { createOrdersMemory } from './orders.memory.js'

describe('orders.memory', () => {
  it('creates an order and can read it back using its id', () => {
    const orders = createOrdersMemory()

    const created = orders.createOrder({
      items: [{ bookId: 'book_1', qty: 2 }],
    })

    const fetched = orders.getOrderById(created.id)

    expect(fetched).not.toBeNull()
    expect(fetched?.id).toBe(created.id)
    expect(fetched?.status).toBe('pending')
    expect(fetched?.items).toEqual([{ bookId: 'book_1', qty: 2 }])
  })
})

it('marks an order as fulfilled', () => {
  const orders = createOrdersMemory()

  const created = orders.createOrder({
    items: [{ bookId: 'book_1', qty: 1 }],
  })

  const fulfilled = orders.markFulfilled(created.id)

  expect(fulfilled).not.toBeNull()
  expect(fulfilled?.id).toBe(created.id)
  expect(fulfilled?.status).toBe('fulfilled')

  const fetched = orders.getOrderById(created.id)
  expect(fetched?.status).toBe('fulfilled')
})
