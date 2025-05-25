import { createMiddleware } from 'hono/factory'
import pino from 'pino'

const logger = pino()

export const pinoLogger = createMiddleware(async (c, next) => {
  c.set('logger', logger)
  await next()
})
