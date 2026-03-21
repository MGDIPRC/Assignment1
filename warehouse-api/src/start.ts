import mongoose from 'mongoose'
import app from './server'

const port = process.env.PORT || 3000

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/app')
    console.log('Database connected')
  } catch (err) {
    console.warn('Database connection failed, continuing without DB')
  }

  app.listen(port, () => {
    console.log(`Warehouse API is running on port ${port}`)
  })
}

start()