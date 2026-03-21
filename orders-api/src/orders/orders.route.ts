import { Body, Get, Path, Post, Route, SuccessResponse, Tags } from 'tsoa'
import { createOrdersMemory } from './orders.memory'
import { sendOrderMessage } from '../rabbit'

const orders = createOrdersMemory()

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

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string')
}

function isFulfilmentInputArray(value: unknown): value is FulfilmentInput[] {
  return (
    Array.isArray(value) &&
    value.every((x) => {
      if (typeof x !== 'object' || x === null) return false
      const v = x as Record<string, unknown>
      return (
        typeof v.book === 'string' &&
        typeof v.shelf === 'string' &&
        typeof v.numberOfBooks === 'number' &&
        Number.isFinite(v.numberOfBooks)
      )
    })
  )
}

@Route('orders')
@Tags('Orders')
export class OrdersRoute {
  @Post()
  @SuccessResponse('201', 'Created')
  public async orderBooks(
    @Body() payload: OrderBooksPayload,
  ): Promise<CreatedOrderResponse> {
    const books = payload?.books

    if (!isStringArray(books) || books.length === 0) {
      throw new Error('Invalid books list')
    }

    const result = orders.createOrder({
      items: books.map((b) => ({ bookId: b, qty: 1 })),
    })

    console.log('ORDER ROUTE HIT')

    await sendOrderMessage({
      type: 'ORDER_CREATED',
      orderId: result.id,
      books,
    })

    return { orderId: result.id }

  }

  @Get()
  public async listOrders(): Promise<ListedOrder[]> {
    return await orders.listOrders()
  }

  @Post('{orderId}/fulfil')
  @SuccessResponse('204', 'No Content')
  public async fulfilOrder(
    @Path() orderId: string,
    @Body() payload: FulfilOrderPayload,
  ): Promise<void> {
    if (typeof orderId !== 'string' || orderId.trim() === '') {
      throw new Error('Missing order id')
    }

    const booksFulfilled = payload?.booksFulfilled
    if (!isFulfilmentInputArray(booksFulfilled)) {
      throw new Error('Invalid booksFulfilled entries')
    }

    await orders.markFulfilled(orderId)
  }
}
