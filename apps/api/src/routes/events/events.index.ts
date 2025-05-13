import { createRouter } from '~/lib/create-app'
import * as handlers from './events.handlers'
import * as routes from './events.routes'

export const eventRoutes = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.deleteEvent, handlers.deleteEvent)
// .openapi(routes.patch, handlers.patch)
// .openapi(routes.remove, handlers.remove)
