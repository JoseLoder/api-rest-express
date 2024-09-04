const express = require('express')
const movies = require('./movies.json')

const PORT = process.env.PORT || 1234
const app = express()
app.disable('x-powered-by')

// Endpoint to get all movies
app.get('/movies', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
})
