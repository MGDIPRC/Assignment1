import { describe, expect, it } from "vitest";
import { InMemoryWarehouse } from "../warehouse/warehouse.memory";
import { createOrdersMemory } from "../orders/orders.memory";
import { fulfilOrder } from "./fulfilment.js";

describe("fulfilment", () => {
  it("fulfils an order and subtracts it from the warehouse stock", async () => {
    const warehouse = new InMemoryWarehouse();
    const orders = createOrdersMemory();

    await warehouse.placeBookOnShelf("book_1", "main", 5);

    const order = orders.createOrder({
      items: [{ bookId: "book_1", qty: 2 }],
    });

    await fulfilOrder(order.id, { orders, warehouse });

    const updatedOrder = orders.getOrderById(order.id);
    const total = await warehouse.getTotalCopies("book_1");

    expect(updatedOrder?.status).toBe("fulfilled");
    expect(total).toBe(3);
  });

  it("doesn't fulfil an order when we don't have enough stock", async () => {
    const warehouse = new InMemoryWarehouse();
    const orders = createOrdersMemory();

    await warehouse.placeBookOnShelf("book_1", "main", 1);

    const order = orders.createOrder({
      items: [{ bookId: "book_1", qty: 2 }],
    });

    await fulfilOrder(order.id, { orders, warehouse });

    const updatedOrder = orders.getOrderById(order.id);
    const total = await warehouse.getTotalCopies("book_1");

    expect(updatedOrder?.status).toBe("pending");
    expect(total).toBe(1);
  });

});
