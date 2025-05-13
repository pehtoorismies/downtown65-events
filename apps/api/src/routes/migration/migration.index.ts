import { createRouter } from '~/lib/create-app'
import * as handlers from './migration.handlers'
import * as routes from './migration.routes'

export const migrationRoutes = createRouter().openapi(
  routes.migrateUsers,
  handlers.migrateUser,
)
// .openapi(routes.create, handlers.create)
// .openapi(routes.getOne, handlers.getOne)
// .openapi(routes.deleteEvent, handlers.deleteEvent)
// .openapi(routes.patch, handlers.patch)
// .openapi(routes.remove, handlers.remove)
