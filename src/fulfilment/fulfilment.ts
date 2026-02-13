type FulfilOrderDeps = {
  orders: {
    getOrderById(id: string): { id: string; items: { bookId: string; qty: number }[] } | null;
    markFulfilled(id: string): unknown;
  };
  warehouse: {
    placeBookOnShelf(bookId: string, shelf: string, count: number): Promise<void>;
  };
};

export async function fulfilOrder(orderId: string, deps: FulfilOrderDeps) {
  const order = deps.orders.getOrderById(orderId);
  if (!order) return null;

  for (const item of order.items) {
    await deps.warehouse.placeBookOnShelf(item.bookId, "main", -item.qty);
  }

  deps.orders.markFulfilled(orderId);
  return deps.orders.getOrderById(orderId);
}
