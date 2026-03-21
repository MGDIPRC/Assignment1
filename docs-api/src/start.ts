import app from './server'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Docs API is running on port ${port}`)
})
