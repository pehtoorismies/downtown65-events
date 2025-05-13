import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'

import { createErrorSchema } from 'stoker/openapi/schemas'
import { insertEventsSchema, selectEventsSchema } from '~/db/schema'
import { StringIdParamsSchema, notFoundSchema } from '~/lib/constants'

const tags = ['Events']

export const list = createRoute({
  method: 'get',
  summary: 'List future events',
  path: '/events',
  securityScheme: 'ApiKeyAuth',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectEventsSchema),
      'The list of future events',
    ),
  },
})

export const getOne = createRoute({
  method: 'get',
  summary: 'Get event by id',
  path: '/events/{id}',
  request: {
    params: StringIdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectEventsSchema,
      'The requested event',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Event not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(StringIdParamsSchema),
      'Invalid id error',
    ),
  },
})

export const deleteEvent = createRoute({
  method: 'delete',
  summary: 'Delete event',
  request: {
    body: jsonContentRequired(
      z.object({
        eventId: z.string().ulid(),
      }),
      'The event to delete',
    ),
  },
  path: '/events/{id}',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        eventId: z.string().ulid(),
      }),
      'Id of deleted event.',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Event not found'),
  },
})

export const create = createRoute({
  method: 'post',
  summary: 'Create an event',
  request: {
    body: jsonContentRequired(insertEventsSchema, 'The event to create'),
  },
  path: '/events',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectEventsSchema, 'The created event'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertEventsSchema),
      'The validation error(s)',
    ),
  },
})

export type ListRoute = typeof list
export type GetOneRoute = typeof getOne
export type CreateRoute = typeof create
export type DeleteRoute = typeof deleteEvent
