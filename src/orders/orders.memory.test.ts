import { describe, expect, it } from "vitest";
import { createOrdersMemory } from "./orders.memory";

describe("orders.memory", () => {
  it("creates an order and can read it back using its id", () => {
    const orders = createOrdersMemory();

    const created = orders.createOrder({
      items: [{ bookId: "book_1", qty: 2 }],
    });

    const fetched = orders.getOrderById(created.id);

    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(created.id);
    expect(fetched?.status).toBe("pending");
    expect(fetched?.items).toEqual([{ bookId: "book_1", qty: 2 }]);
  });
});
