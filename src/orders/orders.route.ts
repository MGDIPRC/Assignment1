import assignment from '../../adapter/assignment-4'
import { Body, Get, Path, Post, Route, Tags } from 'tsoa'

export interface OrderBooksPayload {
  books: string[]
}

export interface CreatedOrderResponse {
  orderId: string
}

export interface FulfilmentInput {
  book: string
  shelf: string
  numberOfBooks: number
}

export interface FulfilOrderPayload {
  booksFulfilled: FulfilmentInput[]
}

export interface ListedOrder {
  orderId: string
  books: Record<string, number>
}

@Route('orders')
@Tags('Orders')
export class OrdersRoute {
  @Post()
  public async orderBooks(
    @Body() payload: OrderBooksPayload,
  ): Promise<CreatedOrderResponse> {
    return await assignment.orderBooks(payload.books)
  }

  @Get()
  public async listOrders(): Promise<ListedOrder[]> {
    return await assignment.listOrders()
  }

  @Post('{orderId}/fulfil')
  public async fulfilOrder(
    @Path() orderId: string,
    @Body() payload: FulfilOrderPayload,
  ): Promise<void> {
    await assignment.fulfilOrder(orderId, payload.booksFulfilled)
  }
}
