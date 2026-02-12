
import type { WarehouseData } from './warehouse.data'
import type { BookID, ShelfId } from './warehouse.types'

export class InMemoryWarehouse implements WarehouseData {
  private books: Record<BookID, Record<ShelfId, number>> = {}

  async placeBookOnShelf(bookId: BookID, shelf: ShelfId, count: number): Promise<void> {
    this.books[bookId] ||= {}
    this.books[bookId][shelf] ||= 0
    this.books[bookId][shelf] += count
  }

  async getCopiesOnShelf(bookId: BookID, shelf: ShelfId): Promise<number> {
    return this.books[bookId]?.[shelf] ?? 0
  }

  async getTotalCopies(bookId: BookID): Promise<number> {
    const shelves = this.books[bookId]
    if (!shelves) return 0
    return Object.values(shelves).reduce((sum, n) => sum + n, 0)
  }
}
