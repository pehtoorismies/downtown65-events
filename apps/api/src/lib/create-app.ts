import { OpenAPIHono } from '@hono/zod-openapi'
import { requestId } from 'hono/request-id'
import notFound from 'stoker/middlewares/not-found'
import onError from 'stoker/middlewares/on-error'
import { defaultHook } from 'stoker/openapi'
import type { AppBindings, AppOpenAPI } from '~/lib/types'
// import { apiKeyMiddleware } from '~/middleware/api-key'
import { pinoLogger } from '~/middleware/pino-logger'

export const createRouter = () => {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}

export const createApp = () => {
  const app = createRouter()
  app.use(requestId())
  app.use(pinoLogger())
  // app.use(apiKeyMiddleware('Kissa'))
  app.notFound(notFound)
  app.onError(onError)
  // SMELL: this is a bit of a hack to get the types right
  return app as AppOpenAPI
}
