import { BookModel } from '../src/models/BookModel'
import mongoose from 'mongoose'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
}

// This is pulling books from the database and applying price filters if any were sent
async function listBooks(
  filters?: Array<{ from?: number; to?: number }>,
): Promise<Book[]> {
  const query: any = {}

  if (filters && filters.length > 0) {
    const orRanges = filters
      .map((f) => {
        const range: any = {}
        if (typeof f.from === 'number') range.$gte = f.from
        if (typeof f.to === 'number') range.$lte = f.to
        return Object.keys(range).length ? { price: range } : null
      })
      .filter(Boolean)

    if (orRanges.length > 0) query.$or = orRanges
  }

  const docs = await BookModel.find(query).lean()

  return docs.map((d: any) => ({
    id: String(d._id),
    name: d.name,
    author: d.author,
    description: d.description,
    price: d.price,
    image: d.image,
  }))
}

// This just makes sure the book info being submitted actually has the stuff needed
function validateBookInput(book: Book) {
  if (!book || typeof book !== 'object')
    throw new Error('No book info was sent')

  const requiredStrings: Array<keyof Book> = [
    'name',
    'author',
    'description',
    'image',
  ]
  for (const key of requiredStrings) {
    const val = book[key]
    if (typeof val !== 'string' || val.trim().length === 0) {
      throw new Error(`You need to include a book ${String(key)}`)
    }
  }

  if (
    typeof book.price !== 'number' ||
    !Number.isFinite(book.price) ||
    book.price < 0
  ) {
    throw new Error('Price of the book needs to be entered')
  }
}

// this handles adding a new book and editing an existing one
async function createOrUpdateBook(book: Book): Promise<BookID> {
  validateBookInput(book)

  // if there is an ID we want it to update that record
  if (book.id) {
    if (!mongoose.Types.ObjectId.isValid(book.id)) {
      throw new Error("That doesn't look right")
    }

    const updated = await BookModel.findByIdAndUpdate(
      book.id,
      {
        name: book.name.trim(),
        author: book.author.trim(),
        description: book.description.trim(),
        price: book.price,
        image: book.image.trim(),
      },
      { new: true },
    ).lean()

    if (!updated) throw new Error("I can't find a book with that ID")

    return String((updated as any)._id)
  }

  // if there is no id this means we need to create a new book
  const created = await BookModel.create({
    name: book.name.trim(),
    author: book.author.trim(),
    description: book.description.trim(),
    price: book.price,
    image: book.image.trim(),
  })

  return String(created._id)
}

// delete a book using its id
async function removeBook(bookId: BookID): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new Error("That book ID doesn't look right")
  }

  const result = await BookModel.deleteOne({ _id: bookId })

  if (result.deletedCount === 0) {
    throw new Error("I can't find a book with that ID")
  }
}

const assignment = 'assignment-2'

// look up a single book by its id
async function getBookById(bookId: BookID): Promise<Book> {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new Error("That book ID doesn't look right and might not even exist")
  }

  const doc = await BookModel.findById(bookId).lean()

  if (!doc) {
    throw new Error("Can't find a book with that ID")
  }

  return {
    id: String((doc as any)._id),
    name: (doc as any).name,
    author: (doc as any).author,
    description: (doc as any).description,
    price: (doc as any).price,
    image: (doc as any).image,
  }
}


export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  getBookById,
}

