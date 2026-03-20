import { Body, Get, Path, Post, Put, Delete, Route, Tags } from 'tsoa'


const booksStore = new Map<string, any>()
let nextId = 1

function createOrUpdateBook(book: any) {
  const id = book.id ?? `book_${nextId++}`
  booksStore.set(id, { ...book, id })
  return id
}

function listBooks() {
  return Array.from(booksStore.values())
}

function lookupBookById(id: string) {
  return booksStore.get(id) ?? null
}

function removeBook(id: string) {
  booksStore.delete(id)
}


interface BookPayload {
  name: string
  author: string
  description: string
  price: number
  image: string
}

interface CreatedResponse {
  id: string
}

@Route('books')
@Tags('Books')
export class BooksRoute {
  @Put('{id}')
  public async updateBook(
    @Path() id: string,
    @Body() bookPayload: BookPayload,
  ): Promise<CreatedResponse> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('Missing book id')
    }

    if (
      typeof bookPayload !== 'object' ||
      bookPayload === null ||
      typeof bookPayload.name !== 'string' ||
      typeof bookPayload.author !== 'string' ||
      typeof bookPayload.description !== 'string' ||
      typeof bookPayload.price !== 'number' ||
      typeof bookPayload.image !== 'string'
    ) {
      throw new Error('Invalid book payload')
    }

    const updatedId = createOrUpdateBook({
      ...bookPayload,
      id,
    })
    return { id: updatedId }
  }

  @Get()
  public async listBooks(): Promise<unknown> {
    return listBooks()
  }

  @Get('{id}')
  public async getBookById(@Path() id: string): Promise<unknown> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('Missing book id')
    }

    return lookupBookById(id)
  }

  @Post()
  public async createBook(@Body() book: BookPayload): Promise<CreatedResponse> {
    if (
      typeof book !== 'object' ||
      book === null ||
      typeof book.name !== 'string' ||
      typeof book.author !== 'string' ||
      typeof book.description !== 'string' ||
      typeof book.price !== 'number' ||
      typeof book.image !== 'string'
    ) {
      throw new Error('Invalid book payload')
    }

    const id = createOrUpdateBook(book)
    return { id }
  }

  @Delete('{id}')
  public async deleteBook(@Path() id: string): Promise<void> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('Missing book id')
    }

    removeBook(id)
  }
}
