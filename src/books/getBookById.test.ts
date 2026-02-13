import { describe, expect, it } from "vitest";
import assignment from "../../adapter/assignment-2";

describe("getBookById", () => {
  it("looks up a single book by its id", async () => {
    const id = await assignment.createOrUpdateBook({
      name: "Test Book",
      author: "Test Author",
      description: "Test Description",
      price: 12.34,
      image: "test.png",
    });

    const book = await assignment.getBookById(id);

    expect(book.id).toBe(id);
    expect(book.name).toBe("Test Book");
  });
});
