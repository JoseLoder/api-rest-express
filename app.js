const express = require('express')
const movies = require('./movies.json')

const PORT = process.env.PORT || 1234
const app = express()
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.status(200).json(movies)
})

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
})
