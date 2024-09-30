import { Hono } from 'hono'
import { db } from '../db/db'
import { itemsSchema, pointItemsSchema, pointsSchema } from '../db/schema'
import { eq, inArray, and, getTableColumns } from 'drizzle-orm'

const app = new Hono()

app.post('/', async (c) => {
  const { name, email, phone, latitude, longitude, city, uf, items } =
    await c.req.json()

  const pointValues = {
    image:
      'https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?q=80&w=1862&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name,
    email,
    phone,
    latitude,
    longitude,
    city,
    uf,
  }

  // TODO: Read Drizzle's documentation about transactions
  const result = await db.transaction(async (tx) => {
    const insertResult = await tx
      .insert(pointsSchema)
      .values(pointValues)
      .returning({ insertedId: pointsSchema.id })

    const pointId = insertResult[0].insertedId

    const pointItemsValues = items.map((itemId: number) => {
      if (itemId > 6) {
        tx.rollback()
      } else {
        return { itemId, pointId }
      }
    })

    await tx.insert(pointItemsSchema).values(pointItemsValues)

    return { id: pointId, ...pointValues }
  })

  return c.json(result)
})

app.get('/:id', async (c) => {
  const inputId = Number(c.req.param('id'))

  const pointInstance = await db
    .select()
    .from(pointsSchema)
    .where(eq(pointsSchema.id, inputId))
    .limit(1)

  if (pointInstance.length === 0) {
    return c.json({ message: 'Point not found.' }, 400)
  }

  const itemsInstance = await db
    .select({
      title: itemsSchema.title,
    })
    .from(itemsSchema)
    .innerJoin(pointItemsSchema, eq(itemsSchema.id, pointItemsSchema.itemId))
    .where(eq(pointItemsSchema.pointId, inputId))

  if (itemsInstance.length === 0) {
    return c.json({ message: 'Matching ids not found.' }, 400)
  }

  return c.json({ pointInstance, itemsInstance })
})

app.get('/', async (c) => {
  const { city, uf, items } = c.req.query()

  // transforma o query "items" de string para array de números
  const parsedItems = String(items)
    .split(',')
    .map((item) => Number(item.trim()))

  /** SELECT DISTINCT points.*
   * FROM points
   * JOIN point_items ON points.point_id = point_items.point_id
   * WHERE point_items.item_id IN (parsedItems)
   *   AND city = 'city_value'
   *   AND uf = 'uf_value';
   */
  const filteredPoints = await db
    .selectDistinct({ ...getTableColumns(pointsSchema) })
    .from(pointsSchema)
    .innerJoin(pointItemsSchema, eq(pointsSchema.id, pointItemsSchema.pointId))
    .where(
      and(
        inArray(pointItemsSchema.itemId, parsedItems),
        eq(pointsSchema.city, String(city)),
        eq(pointsSchema.uf, String(uf))
      )
    )

  if (filteredPoints.length === 0) {
    return c.json({ error: 'No matches.' }, 400)
  }

  return c.json(filteredPoints)
})

export default app
