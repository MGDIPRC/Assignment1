import assignment from '../../adapter/assignment-4'
import { Body, Get, Path, Post, Put, Delete, Route, Tags } from 'tsoa'

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

    const updatedId = await assignment.createOrUpdateBook({
      ...bookPayload,
      id,
    })
    return { id: updatedId }
  }

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

  @Delete('{id}')
  public async deleteBook(@Path() id: string): Promise<void> {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('Missing book id')
    }

    await assignment.removeBook(id)
  }
}
