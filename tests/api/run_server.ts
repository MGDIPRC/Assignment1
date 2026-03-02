import { afterEach, beforeEach } from 'vitest'
import startServer from '../../src/server'

export interface ServerTestContext {
  address: string
  closeServer: () => void
}

export default function (): void {
  beforeEach<ServerTestContext>(async (context) => {
    const instance = startServer(0, true)
    const address = instance.address()

    if (typeof address === 'string') {
      context.address = `http://${address}`
    } else if (address !== null) {
      context.address = `http://localhost:${address.port}`
    } else {
      throw new Error('could not start server')
    }

    context.closeServer = () => {
      instance.close()
    }
  })

  afterEach<ServerTestContext>(async (context) => {
    context.closeServer()
  })
}