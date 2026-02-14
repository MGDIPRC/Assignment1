import mongoose, { Schema } from 'mongoose'
import type { WarehouseData } from './warehouse.data'
import type { BookID, ShelfId } from './warehouse.types'

interface WarehouseStockDoc {
  bookId: string
  shelfId: string
  count: number
}

function getWarehouseDb(): mongoose.Connection {
  return mongoose.connection.useDb('warehouse')
}

function getStockModel(): mongoose.Model<WarehouseStockDoc> {
  const db = getWarehouseDb()

  const schema = new Schema<WarehouseStockDoc>(
    {
      bookId: { type: String, required: true, index: true },
      shelfId: { type: String, required: true, index: true },
      count: { type: Number, required: true },
    },
    { timestamps: true },
  )

  schema.index({ bookId: 1, shelfId: 1 }, { unique: true })

  return (
    db.models.WarehouseStock ??
    db.model<WarehouseStockDoc>('WarehouseStock', schema)
  )
}

export class DatabaseWarehouse implements WarehouseData {
  private readonly Stock = getStockModel()

  public async placeBookOnShelf(
    bookId: BookID,
    shelf: ShelfId,
    count: number,
  ): Promise<void> {
    await this.Stock.updateOne(
      { bookId, shelfId: shelf },
      { $inc: { count } },
      { upsert: true },
    )
  }

  public async getCopiesOnShelf(
    bookId: BookID,
    shelf: ShelfId,
  ): Promise<number> {
    const doc = await this.Stock.findOne({ bookId, shelfId: shelf }).lean()
    return doc?.count ?? 0
  }

  public async getCopiesByShelf(
    bookId: BookID,
  ): Promise<Record<ShelfId, number>> {
    const docs = await this.Stock.find({ bookId }).lean()
    const result: Record<ShelfId, number> = {}
    for (const d of docs) {
      result[d.shelfId] = d.count
    }
    return result
  }

  public async getTotalCopies(bookId: BookID): Promise<number> {
    const docs = await this.Stock.find({ bookId }).lean()
    return docs.reduce((sum, d) => sum + (d.count ?? 0), 0)
  }
}
