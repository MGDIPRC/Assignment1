import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { afterAll } from 'vitest'
import { connectToDatabase } from './src/db.js'

declare global {
  var __MONGO_MEMORY_SERVER__: MongoMemoryServer | undefined
  var __MONGO_REFCOUNT__: number | undefined
  var __MONGO_BASE_URI__: string | undefined
}

export async function setup(): Promise<void> {
  globalThis.__MONGO_REFCOUNT__ = (globalThis.__MONGO_REFCOUNT__ ?? 0) + 1

  if (globalThis.__MONGO_MEMORY_SERVER__ === undefined) {
    const instance = await MongoMemoryServer.create({
      binary: { version: '7.0.7' },
    })

    const uri = instance.getUri()
    const baseUri = uri.slice(0, uri.lastIndexOf('/'))

    globalThis.__MONGO_MEMORY_SERVER__ = instance
    globalThis.__MONGO_BASE_URI__ = baseUri
  }

  const baseUri = globalThis.__MONGO_BASE_URI__ as string
  process.env.MONGODB_URI = baseUri

  // Don't connect a boat load of times if we are already connected
  if (mongoose.connection.readyState === 0) {
    await connectToDatabase()
  }
}

export async function teardown(): Promise<void> {
  globalThis.__MONGO_REFCOUNT__ = (globalThis.__MONGO_REFCOUNT__ ?? 1) - 1

  if (globalThis.__MONGO_REFCOUNT__ <= 0) {
    await mongoose.disconnect()
    await globalThis.__MONGO_MEMORY_SERVER__?.stop({ doCleanup: true })

    globalThis.__MONGO_MEMORY_SERVER__ = undefined
    globalThis.__MONGO_BASE_URI__ = undefined
    globalThis.__MONGO_REFCOUNT__ = 0
  }
}

await setup()
afterAll(teardown)
