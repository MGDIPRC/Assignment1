interface OrderItem {
  bookId: string
  qty: number
}

interface CreateOrderInput {
  items: OrderItem[]
}

interface Order {
  id: string
  status: 'pending' | 'fulfilled'
  items: OrderItem[]
}

interface OrdersPort {
  createOrder: (input: CreateOrderInput) => Order
  getOrderById: (id: string) => Order | null
  markFulfilled: (id: string) => Order | null
  listOrders: () => Order[]
}

export function createOrdersMemory(): OrdersPort {
  const byId = new Map<string, Order>()
  let nextId = 1

  const createId = (): string => {
    const id = `order_${nextId}`
    nextId += 1
    return id
  }

  return {
    createOrder: (input): Order => {
      const order: Order = {
        id: createId(),
        status: 'pending',
        items: input.items,
      }

      byId.set(order.id, order)
      return order
    },

    getOrderById: (id): Order | null => {
      return byId.get(id) ?? null
    },

    markFulfilled: (id): Order | null => {
      const existing = byId.get(id)
      if (existing === undefined) return null

      const updated: Order = { ...existing, status: 'fulfilled' }
      byId.set(id, updated)
      return updated
    },

    listOrders: (): Order[] => {
      return Array.from(byId.values())
    },
  }
}
