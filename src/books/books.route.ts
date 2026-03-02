import { Body, Get, Path, Post, Route, Tags } from 'tsoa'
import assignment from '../../adapter/assignment-4'

type BookPayload = {
  name: string
  author: string
  description: string
  price: number
  image: string
}

type CreatedResponse = { id: string }

@Route('books')
@Tags('Books')
export class BooksRoute {

  @Get('{id}')
  public async getBookById(@Path() id: string): Promise<unknown> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('Missing book id')
    }

    return await assignment.lookupBookById(id)
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

    const id = await assignment.createOrUpdateBook(book)
    return { id }
  }
}