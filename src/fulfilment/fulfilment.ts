interface FulfilOrderDeps {
  orders: {
    getOrderById: (id: string) => { id: string; items: Array<{ bookId: string; qty: number }> } | null
    markFulfilled: (id: string) => unknown
  }
  warehouse: {
    placeBookOnShelf: (bookId: string, shelf: string, count: number) => Promise<void>
    getTotalCopies: (bookId: string) => Promise<number>
  }
}

export async function fulfilOrder(
  orderId: string,
  deps: FulfilOrderDeps,
): Promise<boolean | null> {
  const order = deps.orders.getOrderById(orderId)
  if (order === null) return null

  for (const item of order.items) {
    const available = await deps.warehouse.getTotalCopies(item.bookId)
    if (available < item.qty) return false
  }

  for (const item of order.items) {
    await deps.warehouse.placeBookOnShelf(item.bookId, 'main', -item.qty)
  }

  deps.orders.markFulfilled(orderId)
  return true
}
