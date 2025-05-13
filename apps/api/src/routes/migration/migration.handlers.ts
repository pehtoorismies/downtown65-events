import { ManagementClient } from 'auth0'
import type { AppRouteHandler } from '~/lib/types'
import type { MigrateUsersRoute } from '~/routes/migration/migration.routes'

import { z } from 'zod'
import { getDB } from '~/db'
import { users } from '~/db/schema'

const Auth0UserSchema = z.object({
  user_id: z.string(),
  email: z.string(),
  name: z.string(),
  nickname: z.string(),
  picture: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  user_metadata: z.object({
    subscribeWeeklyEmail: z.boolean(),
    subscribeEventCreationEmail: z.boolean(),
  }),
  app_metadata: z.object({ role: z.enum(['USER', 'ADMIN']) }),
})

const QUERY_USER_RETURNED_FIELDS = [
  'user_id',
  'email',
  'name',
  'nickname',
  'picture',
  'updated_at',
  'created_at',
  'user_metadata',
  'app_metadata',
].join(',')

export const migrateUser: AppRouteHandler<MigrateUsersRoute> = async (c) => {
  const db = getDB(c.env.DB)
  const { logger } = c.var

  const management = new ManagementClient({
    domain: c.env.AUTH0_DOMAIN,
    clientId: c.env.AUTH0_CLIENT_ID,
    clientSecret: c.env.AUTH0_CLIENT_SECRET,
    // SMELL: This is a workaround for the fetch issue in auth0
    async fetch(url, init) {
      return fetch(url, init)
    },
  })

  const allUsers = []
  let page = 0
  while (true) {
    const {
      data: { users, total },
    } = await management.users.getAll({
      include_totals: true,
      page: page++,
      fields: QUERY_USER_RETURNED_FIELDS,
      sort: 'created_at:1',
    })
    allUsers.push(...users)
    if (allUsers.length === total) {
      break
    }
  }

  const auth0Users = allUsers
    .map((user) => {
      return Auth0UserSchema.parse(user)
    })
    .map((user) => {
      const {
        user_id,
        user_metadata,
        app_metadata,
        picture,
        created_at,
        updated_at,
        ...rest
      } = user
      return {
        ...rest,
        userId: user_id,
        profilePictureUrl: picture,
        role: app_metadata.role,
        createdAt: created_at,
        updatedAt: updated_at,
      }
    })

  const nicknames = auth0Users.map(({ nickname, email }) => ({
    [nickname]: email,
  }))
  logger.trace('Nicknames', nicknames)

  const migrateUsers = []
  let successCount = 0
  let failureCount = 0

  for (const user of auth0Users) {
    logger.debug('Start migrateUser -->', user)
    const [inserted] = await db
      .insert(users)
      .values(user)
      .onConflictDoNothing()
      .returning()

    if (inserted == null) {
      logger.debug('End migrateUser --> did not migrate user')
    } else {
      logger.debug('End migrateUser --> successfully migrate user')
    }

    migrateUsers.push({
      nickname: user.nickname,
      name: user.name,
      success: inserted !== undefined,
    })
    if (inserted !== undefined) {
      successCount++
    } else {
      failureCount++
    }
  }

  logger.info('Migrate users result', migrateUsers)
  return c.json({
    message: `Migrated. Success: ${successCount}. Failure: ${failureCount}`,
  })
}
