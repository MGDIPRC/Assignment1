import mongoose from 'mongoose'
import app from "./server";

const port = process.env.PORT || 3000

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('Database connected')
  } catch (err) {
    console.warn('Database connection failed, continuing without DB')
  }

  app.listen(port, () => {
    console.log(`Orders API is running on port ${port}`)
  })
}

start()