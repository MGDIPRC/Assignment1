import mongoose from 'mongoose'
import app from './server'
import { startConsumer } from './rabbit'

const port = process.env.PORT || 3000

async function connectRabbitWithRetry() {
  let connected = false

  while (!connected) {
    try {
      await startConsumer()
      console.log('Connected to RabbitMQ')
      connected = true
    } catch (err) {
      console.log('RabbitMQ not ready, retrying in 3 seconds...')
      await new Promise(res => setTimeout(res, 3000))
    }
  }
}

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log('Database connected')
  } catch (err) {
    console.warn('Database connection failed, continuing without DB')
  }

  await connectRabbitWithRetry()

  app.listen(port, () => {
    console.log(`Warehouse API is running on port ${port}`)
  })
}

start()