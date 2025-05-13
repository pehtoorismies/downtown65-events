import { eq } from 'drizzle-orm'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { ulid } from 'ulid'
import { getDB } from '~/db'
import { events } from '~/db/schema'
import type { AppRouteHandler } from '~/lib/types'
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
} from '~/routes/events/events.routes'

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = getDB(c.env.DB)
  const result = await db.select().from(events)
  return c.json(result)
}

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = getDB(c.env.DB)
  const { id } = c.req.valid('param')

  const event = await db.query.events.findFirst({
    where(fields, operators) {
      return operators.eq(fields.eventId, id)
    },
  })

  if (event == null) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    )
  }

  return c.json(event, HttpStatusCodes.OK)
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = getDB(c.env.DB)
  const input = c.req.valid('json')
  const eventId = ulid()

  // const category = input.category == null ? null : (input.category as string)

  const [inserted] = await db
    .insert(events)
    .values({
      ...input,
      eventId,
      creator: 1, // Get from cookie
    })
    .returning()

  return c.json(inserted, HttpStatusCodes.OK)
}

export const deleteEvent: AppRouteHandler<DeleteRoute> = async (c) => {
  const db = getDB(c.env.DB)
  const input = c.req.valid('json')

  const deleted: { eventId: string }[] = await db
    .delete(events)
    .where(eq(events.eventId, input.eventId))
    .returning({ eventId: events.eventId })

  if (deleted.length === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    )
  }

  return c.json(deleted[0], HttpStatusCodes.OK)
}
