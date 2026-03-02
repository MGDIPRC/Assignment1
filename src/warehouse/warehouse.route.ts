import assignment from '../../adapter/assignment-4'
import { Body, Get, Path, Post, Route, SuccessResponse, Tags } from 'tsoa'

export interface ShelfCountPayload {
  count: number
}

@Route('warehouse')
@Tags('Warehouse')
export class WarehouseRoute {
  @Post('{bookId}/shelves/{shelfId}')
  @SuccessResponse('204', 'No Content')
  public async placeBooksOnShelf(
    @Path() bookId: string,
    @Path() shelfId: string,
    @Body() body: ShelfCountPayload,
  ): Promise<void> {
    if (typeof bookId !== 'string' || bookId.trim() === '') {
      throw new Error('Missing book id')
    }

    if (typeof shelfId !== 'string' || shelfId.trim() === '') {
      throw new Error('Missing shelf id')
    }

    const count = body?.count

    if (typeof count !== 'number' || !Number.isFinite(count)) {
      throw new Error('Missing or invalid count')
    }

    await assignment.placeBooksOnShelf(bookId, count, shelfId)
    return
  }

  @Get('{bookId}')
  public async findBookOnShelf(@Path() bookId: string): Promise<unknown> {
    if (typeof bookId !== 'string' || bookId.trim() === '') {
      throw new Error('Missing book id')
    }

    const shelves = await assignment.findBookOnShelf(bookId)
    return shelves
  }
}