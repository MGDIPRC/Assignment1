import { connectToDatabase } from './src/db'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { afterAll } from 'vitest'
import mongoose from 'mongoose'


let instance: MongoMemoryServer

export async function setup(): Promise<void> {
  instance = await MongoMemoryServer.create({
    binary: { version: '7.0.7' },
  })

  const uri = instance.getUri()
  const baseUri = uri.slice(0, uri.lastIndexOf('/'))

    ; (global as any).__MONGOINSTANCE = instance
    ; (global as any).MONGO_URI = baseUri

  process.env.MONGO_URI = baseUri
  process.env.MONGODB_URI = baseUri

  await connectToDatabase()
}

export async function teardown(): Promise<void> {
  await mongoose.disconnect()
  await instance.stop({ doCleanup: true })
}

await setup()
afterAll(teardown)
