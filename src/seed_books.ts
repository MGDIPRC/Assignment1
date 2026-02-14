import 'dotenv/config'
import mongoose from 'mongoose'
import books from '../mcmasterful-book-list.json'
import { BookModel } from './models/BookModel'
import { connectToDatabase } from './db'

async function main(): Promise<void> {
  await connectToDatabase()

  const existing = await BookModel.countDocuments()
  if (existing > 0) {
    console.log(`Books already exist in DB (${existing}). Not seeding.`)
    return
  }

  await BookModel.insertMany(books)
  console.log(`Seeded ${books.length} books into MongoDB.`)
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err)
    process.exitCode = 1
  })
  .finally(() => {
    void mongoose.disconnect()
  })
