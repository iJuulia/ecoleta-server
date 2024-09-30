import { Hono } from 'hono'
import { db } from '../db/db'
import { itemsSchema } from '../db/schema'

const app = new Hono()

app.get('/', async (c) => {
  const itemsList = await db.select().from(itemsSchema)
  const serializedItemsList = itemsList.map((item) => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/images/${item.image}`,
    }
  })

  return c.json(serializedItemsList)
})

export default app
