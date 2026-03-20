import mongoose from 'mongoose'
import app from "./server";

const port = process.env.PORT || 3002

async function start() {
  await mongoose.connect('mongodb://localhost:27017/app')

  app.listen(port, () => {
    console.log(`Warehouse API is running on port ${port}`)
  })
}

start()