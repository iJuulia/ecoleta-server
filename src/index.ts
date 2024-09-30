import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import itemsRoute from './routes/items'
import pointsRoute from './routes/points'

const app = new Hono()
app.use('/images/*', serveStatic({ root: './' }))
app.use('/', cors())

// routing
app.get('/', (c) => c.text('Hello World!'))
app.route('/items', itemsRoute)
app.route('/points', pointsRoute)

export default {
  port: 3333,
  fetch: app.fetch,
}
