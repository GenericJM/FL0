const express = require('express')
const app = express()

const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js')
const PORT = process.env.PORT ?? 3000
app.disable('x-powered-by')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})
const ACEPTED_ORIGIN = ['http://127.0.0.1:5500']

app.get('/movies', (req, res) => {
  const origin = req.header('origin')
  if (ACEPTED_ORIGIN.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  const { genre } = req.query
  if (genre) {
    const filterMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filterMovies)
  }
  res.json(movies)
})
app.get('/movies/:id', (req, res) => { // path-to-regex
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json('movie not found')
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(404).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)
  // 201 creado nuevo recurso
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(404).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'movie not found' })
  }
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACEPTED_ORIGIN.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    res.status(404).json({ message: 'recurso no encontrado' })
  }
  movies.splice(movieIndex, 1)
  return res.json({ message: 'movie Deleted' })
})
app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACEPTED_ORIGIN.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, POST')
  }
  res.sendStatus(200)
})
app.listen(PORT, () => {
  console.log(`server listen on port http://localhost:${PORT}`)
})
