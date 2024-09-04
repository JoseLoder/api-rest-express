const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const PORT = process.env.PORT || 1234
const app = express()
app.disable('x-powered-by')
app.use(express.json())

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://127.0.0.1:5500',
  'https://my-app.com'

]

// Endpoint to get all movies
app.get('/movies', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1234')
  }

  const { genre } = req.query
  if (genre) {
    // filter() retorna un nuevo array con los elementos que cumplan la condición del callback
    const filteredMovies = movies.filter(
      // some() retorna true si al menos un elemento cumple la condición del callback
      (movie) => movie.genre.some(
        // Mientras que el genero de la pelicula sea igual al genero requerido
        (g) => g.toLowerCase() === genre.toLowerCase()
      )
    )
    return res.status(200).json(filteredMovies)
  }
  res.status(200).json(movies)
})

// Endpoint to get a movie by id
app.get('/movies/:id', (req, res) => { // path-to-regexp
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.status(200).json(movie)
  res.status(404).json({ error: 'Movie not found' })
})

// Endpoint to create a new movie
app.post('/movies', (req, res) => {
  const validated = validateMovie(req.body)

  if (validated.error) {
    return res.status(400).json(validated.error)
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...validated.data
  }

  // Esto no es REST ya que no se guarda en memoria
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

// Endpoint to update a movie by id
app.patch('/movies/:id', (req, res) => {
  // Validación de los datos
  const result = validatePartialMovie(req.body)
  if (!result.success) { // other way to validate
    return res.status(400).json(result.error)
  }

  // Buscar la película
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return res.status(404).json({ error: 'Movie not found' })

  // Actualizar la película
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updateMovie

  // Retornar la película actualizada
  res.status(200).json(movies[movieIndex])
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found, soorry!' })
})

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
})
