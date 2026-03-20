import mongoose from 'mongoose'
import 'dotenv/config'

export async function connectToDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI

  if (uri === undefined || uri.trim() === '') {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  await mongoose.connect(uri)
}
