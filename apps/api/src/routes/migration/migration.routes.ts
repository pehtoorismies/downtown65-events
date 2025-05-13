import { createRoute } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { jsonContent } from 'stoker/openapi/helpers'
import { createMessageObjectSchema } from 'stoker/openapi/schemas'

const tags = ['Migration']

export const migrateUsers = createRoute({
  method: 'post',
  path: '/migrate/users',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.OK),
      'Show status of migration result',
    ),
  },
})

export type MigrateUsersRoute = typeof migrateUsers
