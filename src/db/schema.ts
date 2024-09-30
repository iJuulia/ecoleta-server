import { text, integer, sqliteTable, real } from 'drizzle-orm/sqlite-core'

export const pointsSchema = sqliteTable('points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  image: text('image').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  city: text('city').notNull(),
  uf: text('uf', { length: 2 }).notNull(),
})

export const itemsSchema = sqliteTable('items', {
  id: integer('id').primaryKey(),
  title: text('name').notNull(),
  image: text('image').notNull(),
})

export const pointItemsSchema = sqliteTable('pointItems', {
  id: integer('id').primaryKey(),
  pointId: integer('pointId')
    .notNull()
    .references(() => pointsSchema.id),
  itemId: integer('itemId')
    .notNull()
    .references(() => itemsSchema.id),
})
