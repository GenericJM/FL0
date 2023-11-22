const z = require('zod')
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'movie title must be a string',
    required_error: 'movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: 'must be a valid url'
  }),
  genre: z.array(
    z.enum(['Action', 'Crime', 'Drama', 'Adventure', 'Sci-Fi', 'Romance', 'Adventure', 'Sci-Fi', 'Animation', 'Biography', 'Fantasy'])
  )
})
function validateMovie (object) {
  return movieSchema.safeParse(object)
}
function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}
module.exports = { validateMovie, validatePartialMovie }
