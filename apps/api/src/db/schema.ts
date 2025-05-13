import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

const EVENT_CATEGORIES = ['PRACTICE', 'RACE', 'OTHER'] as const

export const events = sqliteTable('events_table', {
  id: int().primaryKey({ autoIncrement: true }),
  eventId: text('event_id').notNull().unique(),
  title: text().notNull(),
  subtitle: text().notNull(),
  description: text(),
  location: text().notNull(),
  category: text().notNull(),
  type: text().notNull(),
  dateStart: text('date_start').notNull(),
  timeStart: text('time_start'),
  creator: int('creator_id').references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
  updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
})

export const users = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique(),
  nickname: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text(),
  profilePictureUrl: text('profile_picture_url'),
  role: text()
    .$type<'ADMIN' | 'USER' | 'SPINNING_INSTRUCTOR'>()
    .default('USER')
    .notNull(),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
  updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
})

export const usersToEvents = sqliteTable('users_to_events_table', {
  id: int().primaryKey({ autoIncrement: true }),
  eventId: int('event_id').references(() => events.id),
  userId: int('user_id').references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
})

export const usersRelations = relations(users, ({ many }) => ({
  usersToEvents: many(usersToEvents),
}))

// Tags relations
export const eventsRelations = relations(events, ({ many }) => ({
  usersToEvents: many(usersToEvents),
}))

// Join table relations
// export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
//   post: one(posts, {
//     fields: [postsToTags.postId],
//     references: [posts.id],
//   }),
//   tag: one(tags, {
//     fields: [postsToTags.tagId],
//     references: [tags.id],
//   }),
// }))

export const selectEventsSchema = createSelectSchema(events)
export const insertEventsSchema = createInsertSchema(events, {
  category: z.enum(EVENT_CATEGORIES),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  eventId: true,
})
export const insertUsersSchema = createInsertSchema(users).omit({
  id: true,
})

export const selectUsersSchema = createSelectSchema(events)
