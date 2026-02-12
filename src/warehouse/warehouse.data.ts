import type { BookID, ShelfId } from './warehouse.types'

export interface WarehouseData {
  placeBookOnShelf(bookId: BookID, shelf: ShelfId, count: number): Promise<void>
  getCopiesOnShelf(bookId: BookID, shelf: ShelfId): Promise<number>
  getTotalCopies(bookId: BookID): Promise<number>
}
