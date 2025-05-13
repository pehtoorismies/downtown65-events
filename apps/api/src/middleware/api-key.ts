import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import * as HttpStatusCodes from 'stoker/http-status-codes'

export const apiKeyMiddleware = (apiKey: string) =>
  createMiddleware(async (c, next) => {
    const requestApiKey = c.req.header('x-api-key')
    if (!requestApiKey || requestApiKey !== apiKey) {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: 'Invalid or missing API key',
      })
    }
    await next()
  })
