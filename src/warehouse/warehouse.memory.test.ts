import { describe, test, expect } from 'vitest'
import { InMemoryWarehouse } from './warehouse.memory'
test('gets total stock for a book', async () => {
  const warehouse = new InMemoryWarehouse()

  await warehouse.placeBookOnShelf('book-1', 'shelf-A', 3)
  await warehouse.placeBookOnShelf('book-1', 'shelf-B', 2)

  const total = await warehouse.getTotalCopies('book-1')

  expect(total).toBe(5)
})
