type OrderItem = {
  bookId: string;
  qty: number;
};

type CreateOrderInput = {
  items: OrderItem[];
};

type Order = {
  id: string;
  status: "pending" | "fulfilled";
  items: OrderItem[];
};

type OrdersPort = {
  createOrder(input: CreateOrderInput): Order;
  getOrderById(id: string): Order | null;
  markFulfilled(id: string): Order | null;
  listOrders(): Order[];
};

export function createOrdersMemory(): OrdersPort {
  const byId = new Map<string, Order>();
  let nextId = 1;

  function createId() {
    const id = `order_${nextId}`;
    nextId += 1;
    return id;
  }

  return {
    createOrder(input) {
      const order: Order = {
        id: createId(),
        status: "pending",
        items: input.items,
      };

      byId.set(order.id, order);
      return order;
    },

    getOrderById(id) {
      return byId.get(id) ?? null;
    },

    markFulfilled(id) {
      const existing = byId.get(id);
      if (!existing) return null;

      const updated: Order = { ...existing, status: "fulfilled" };
      byId.set(id, updated);
      return updated;
    },

    listOrders() {
      return Array.from(byId.values());
    },


  };
}
